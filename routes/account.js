const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

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

// Handle POST requests to /signup
// when the user submits the data in the sign up form, it will come here
router.post("/signup", (req, res, next) => {
    // we use req.body to grab data from the input form
     const {fname, sname, email, password} = req.body
    //console.log(req.body) // check if this is an empty object
    // if not use the length 


    //validate first
    // checking if the user has entered all three fields
    // we're missing one important step here
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

// handle post requests when the user submits something in the sign in form
router.post("/signin", (req, res, next) => {
    const {email, password} = req.body

    // implement the same set of validations as you did in signup as well
    // NOTE: We have used the Async method here. Its just to show how it works
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
                            req.session.areyoutired = false
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


// GET request to handle /profile

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
    res.render('profile.hbs', {email })
})


//router.get(path, callback,callback,callback,callback,callback)
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})






module.exports = router;



// {"cookie":
//     {"originalMaxAge":86400000,
//     "expires":"2021-02-10T14:57:09.403Z",
//     "httpOnly":true,
//     "path":"/"},
//  "userData":{
//       "_id":"602269a49bbe4d24c814eba3",
//       "name":"manish",
//       "email":"a@a.com",
//       "password":"$2a$10$Ft8J7o5v7ntc1hMJN/DIfe94l7VXrugk9ZraQyB6RYpMDfKOXq6I6","__v":0}}