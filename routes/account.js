const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')
const catroommodel= require('../models/catroom.model')

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

router.get("/standardroom", (req, res, next)=>{
    res.render('standardroom.hbs')
})
router.get("/vicroom",(req,res,next)=>{
    res.render('vicroom.hbs')
})

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

router.get('/profile', checkLoggedInUser, (req, res, next) => {
    let email = req.session.userData.email
    let fname = req.session.userData.fname
    catroommodel.find()
        .then((result) => {
        res.render('profile.hbs', {result} )
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
    const updatedroom = {room_type,number_of_cats,catsize,number_of_nights, date, phonenumber, owneraddress}
    catroommodel.findByIdAndUpdate(id, updatedroom)
    .then(() => {
      res.redirect('/profile')
    }).catch((err) => {
      res.render('update_form.hbs')
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


