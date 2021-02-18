const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')
const catroommodel= require('../models/catroom.model')
const adminModel = require('../models/admin.model')

/* GET signin page */
router.get("/signin", (req, res, next) => {
    // Shows the sign in form to the user
    res.render('verify/signin.hbs')
    
});

/* GET signup page */
router.get("/signup", (req, res, next) => {
    // Shows the sign up form to the user
    res.render('verify/signup.hbs')
});

//Admin
router.get("/adminsignin", (req, res, next) => {
    // Shows the sign in form to the user
    res.render('verify/adminsignin.hbs')   
});

/* GET signup page  for the admin*/
router.get("/adminsignup", (req, res, next) => {
    // Shows the sign up form to the user
    res.render('verify/adminsignup.hbs')
});

//user
router.get("/views/standardroom", (req, res, next)=>{
    res.render('standardroom.hbs')
})
//admin.hbs
router.get("/admin", (req, res, next)=>{
    res.render('admin.hbs')
});

router.get("/views/vicroom",(req,res,next)=>{
    res.render('vicroom.hbs')
})
//adminsiginup post requests
router.post("/adminsignup", (req, res, next)=>{
    const {adminname, adminemail, adminpassword}= req.body
    if (!adminname.length || !adminemail.length || !adminpassword.length) {
        res.render('verify/adminsignup', {msg: 'Please enter all fields'})
        return;
            }
    let re = /\S+@\S+\.\S+/;
     if (!re.test(adminemail)) {
        res.render('verify/signup', {msg: 'Email not in valid format'})
        return;
     }

     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(adminpassword, salt);
     adminModel.create({adminname, adminemail, adminpassword: hash})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        }) 

        
});
// Admin sigin requests
router.post("/adminsignin", (req, res, next) => {
    const {adminemail, adminpassword} = req.body

    adminModel.findOne({adminemail: adminemail})
        .then((result) => {
            // if user exists
            if (result) {
                //check if the entered password matches with that in the DB
                bcrypt.compare(adminpassword, result.adminpassword)
                    .then((isMatching) => {
                        if (isMatching) {
                            // when the user successfully signs up
                             req.session.userData = result
                             req.session.areyoutired = true
                             res.redirect('/userRequests')   
                        }
                        else {
                            // when passwords don't match
                            res.render('verify/adminsignin.hbs', {msg: 'Passwords dont match'})
                        }
                    })
            }
            else {
                // when the user signs in with an email that does not exits
                res.render('verify/adminsignin.hbs', {msg: 'Email does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })
   
});

// Handle POST requests to /signup
router.post("/signup", (req, res, next) => {
    // we use req.body to grab data from the input form
    const {fname, sname, email, password} = req.body
   
   
    
    // if (!fname.length || !sname.length || !email.length || !password.length) {
    //     res.render('verify/signup', {msg: 'Please enter all fields'})
    //     return;
    // }

    // // validate if the user has entered email in the right format ( @ , .)
    //  // regex that validates an email in javascript
    //  let re = /\S+@\S+\.\S+/;
    //  if (!re.test(email)) {
    //     res.render('verify/signup', {msg: 'Email not in valid format'})
    //     return;
    //  }

     //validate password (special character, some numbers, min 6 length)
     /*
     let regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
     if (!regexPass.test(password)) {
        res.render('account/signup', {msg: 'Password needs to have special chanracters, some numbers and be 6 characters aatleast'})
        return;
     }

     */
     // creating a user,,,hash the password 
     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(password, salt);

     let newUser = {
        fname,
        sname,
        email,
        password: hash
    }
     UserModel.create(newUser)
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
});
// post rq for standardroom
router.post("/views/standardroom",(req, res, next)=>{
const {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body

    // To restrict people from creating multiple rooms
    // 1.First find if any rooms exist for that user
    //    a. if yes, then redirect to some page
    //    b. If no then create a catroom 


    let userId = req.session.userData._id

    //1. Step 1

    catroommodel.find({user: userId})
        .then((results) => {
            // if rooms exists, then results will be an array of objects

            if (results.length) {
                //change this later
                res.redirect('/profile')
            }
            else {
                // this part runs if no rooms exist for the user
                catroommodel.create({
                    room_type,
                    number_of_cats,
                    catsize,number_of_nights,
                    date,
                    phonenumber,
                    owneraddress,
                    status: 'pending',
                    user: req.session.userData._id
                })
                .then(() => {
                    res.redirect('/profile')
                })
                .catch((err) => {
                    next(err)
                })
            }
            
        })
        .catch((err) =>{
            next(err)
        })

    

})
// post requests for vicroom
router.post("/views/vicroom",(req, res, next)=>{
    const {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body
    let userId = req.session.userData._id
    catroommodel.find({user: userId})
    .then((results) => {
                if (results.length) {
                    //change this later
                    res.redirect('/profile')
                }
                else {
                    // this part runs if no rooms exist for the user
                    catroommodel.create({
                        room_type,
                        number_of_cats,
                        catsize,number_of_nights,
                        date,
                        phonenumber,
                        owneraddress,
                        status: 'pending',
                        user: req.session.userData._id
                    })
                    .then(() => {
                        res.redirect('/profile')
                    })
                    .catch((err) => {
                        next(err)
                    })
                }

                // res.redirect('/profile')
            })
            .catch((err) => {
                next(err)
            })
    
})

// handle post requests when the user submits something in the sign in form
router.post("/signin", (req, res, next) => {
    const {email, password} = req.body

    UserModel.findOne({email: email})
        .then((result) => {
            // if user exists
            if (result) {
                //check if the entered password matches with that in the DB
                bcrypt.compare(password, result.password)
                    .then((isMatching) => {
                        if (isMatching) {
                            // when the user successfully signs up
                             req.session.userData = result
                             res.redirect('/profile')   
                        }
                        else {
                            // when passwords don't match
                            res.render('verify/signin.hbs', {msg: 'Passwords dont match'})
                        }
                    })
            }
            else {
                // when the user signs in with an email that does not exits
                res.render('verify/signin.hbs', {msg: 'Email does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })
   
});


// cat room 
const checkLoggedInUser = (req, res, next) => {
 //   let email = req.session.userData.email
     if (req.session.userData) {
        next()
     }
     else {
         res.redirect('/signin')
     }
     
}
//user login
router.get('/profile', checkLoggedInUser, (req, res, next) => {
    let userId=req.session.userData._id
    catroommodel.find({user:userId})
        .then((result) => {
        res.render('profile.hbs', {result} )
        })
        .catch((err) => {
            console.log(err)
        });
})

//ADMIN LOGIN
const checkAdminLoggedInUser =(req, res, next) => {
    //   let email = req.session.userData.email
        if (req.session.userData) {
           next()
        }
        else {
            res.redirect('/adminsignin')
        }
        
}

router.get('/userRequests', checkAdminLoggedInUser, (req, res, next) => {

    catroommodel.find()
        .then((result) =>{
            res.render('userRequests.hbs', {result})

        })
        .catch((error)=>{
            next(error)
        })
});


  //get request for admin
  router.get('/views/:id/edit', (req, res, next) => {
    let id = req.params.id
    catroommodel.findByIdAndUpdate(id, {status:'confirmed'})
      .then(() => {
        res.render('userRequests.hbs')
      
    })
    .catch((err) => {
      console.log(err)
    });
  });

// delete a booking
router.get('/views/:id/delete', (req, res, next) => {

    let id = req.params.id
   
    catroommodel.findByIdAndDelete(id)
    .then(() => {      
      res.redirect('/userRequests')
    })
    .catch((err) => {
        next(err)
    });
  });
// admin get request for deleting request

// router.get('/views/:id/delete', (req, res, next) => {
//     let id = req.params.id
    
//     catroommodel.findById(id)
//       .then((result) => {
//         res.render('userRequests',{result})
//     })
//     .catch((err) => {
//       console.log(err)
//     });
//   });
  ///end admin



  // editing form
  router.post('/user/:id/edit', (req, res, next) => {
    
    let id = req.params.id
    const {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body
    
    let updatedroom = {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}
        catroommodel.findByIdAndUpdate(id, updatedroom)
            .then(() => {
            res.redirect('/profile')
            })
            .catch((err) => {
            //   res.render('update_form.hbs')
            console.log(err, 'error while updating room booking')
            });
  });

  router.get('/user/:id/edit', (req, res, next) => {
    
    // update booking
    let id = req.params.id
    
    catroommodel.findById(id)
      .then((result) => {
        res.render('update_form.hbs',{result})
      
    })
    .catch((err) => {
      console.log(err)
    });
  });

// user delete a booking
router.post('/user/:id/delete', (req, res, next) => {

    let id = req.params.id
    catroommodel.findByIdAndDelete(id)
    .then((result) => {
      res.redirect('/profile')
    }).catch((err) => {
      console.log('deletion has failed',err)
    });
  });
  

router.get('/user/vicroom', checkLoggedInUser, (req, res, next) => {
        res.render('vicroom')
    
})

router.get('/user/standardroom', checkLoggedInUser,( req, res, next)=>{
    res.render('standardroom')
})

//router.get
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})






module.exports = router;


