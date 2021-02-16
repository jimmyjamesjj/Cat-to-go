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
router.get("/standardroom", (req, res, next)=>{
    res.render('standardroom.hbs')
})
router.get("/vicroom",(req,res,next)=>{
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

        
})
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
    
    if (!fname.length || !sname.length || !email.length || !password.length) {
        res.render('verify/signup', {msg: 'Please enter all fields'})
        return;
    }

    // validate if the user has entered email in the right format ( @ , .)
     // regex that validates an email in javascript
     let re = /\S+@\S+\.\S+/;
     if (!re.test(email)) {
        res.render('verify/signup', {msg: 'Email not in valid format'})
        return;
     }

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
     UserModel.create({fname, sname, email, password: hash})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
});
// post rq for standardroom
router.post("/views/standardroom",(req, res, next)=>{
const {number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body
catroommodel.create({number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress})
.then(() => {
    res.redirect('/profile')
})
.catch((err) => {
    next(err)
})

})
// post requests for vicroom
router.post("/views/vicroom",(req, res, next)=>{
    const {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body
    catroommodel.create({room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress})
    .then(() => {
        res.redirect('/profile')
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
                             req.session.areyoutired = true
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
//Middleware to protect routes
const checkLoggedInUser = (req, res, next) => {
     if (req.session.userData) {
        next()
     }
     else {
         res.redirect('/signin')
     }
     
}
//user login
router.get('/profile', checkLoggedInUser, (req, res, next) => {
    let email = req.session.userData.email
    let fname = req.session.userData.fname
    catroommodel.find()
        .then((result) => {
        res.render('profile.hbs', {fname,result} )
        })
        .catch((err) => {
            console.log(err)
        });
})
//ADMIN LOGIN
router.get('/userRequests', checkLoggedInUser, (req, res, next) => {
    let fname = req.session.userData.fname
    adminModel.find()
        .then((result) => {
        res.render('userRequests.hbs', {fname,result} )
        })
        .catch((err) => {
            console.log(err)
        });
})


router.get('/views/:id/edit', (req, res, next) => {
    
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
  // editing form
  router.post('/views/:id/edit', (req, res, next) => {
    // Iteration #4: Update the drone
    // ... your code here
    let id = req.params.id
    const {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}=req.body
    console.log(req.body)
    console.log(req.params)
    let updatedroom = {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}
    catroommodel.findByIdAndUpdate(id, updatedroom)
    .then((result) => {
        console.log(result, 'updated booking')
      res.redirect('/profile')
    })
    .catch((err) => {
    //   res.render('update_form.hbs')
    console.log(err, 'error while updating room booking')
    });
  });
// delete a booking
router.post('/views/:id/delete', (req, res, next) => {
    // Iteration #5: Delete the drone
    // ... your code here
  
    let id = req.params.id
    catroommodel.findByIdAndDelete(id)
    .then((result) => {
      console.log('deletion has succeded',result)
      res.redirect('/profile')
    }).catch((err) => {
      console.log('deletion has failed',err)
    });
  });
  

router.get('/views/vicroom', checkLoggedInUser, (req, res, next) => {
        res.render('vicroom')
    
})

router.get('/views/standardroom', checkLoggedInUser,( req, res, next)=>{
    res.render('standardroom')
})

//router.get
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})






module.exports = router;


