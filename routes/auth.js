const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');
const JWT_SECRET = 'spiderman123';
const mongoose = require('mongoose');



// Route No----- 1    create User:-- Post method----- api/auth/createuser--------//

router.post('/createuser', [
   body('name', 'Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password atleast 5 character').isLength({ min: 5 })
],
   async (req, res) => {
      let success = false
      //errors or bad request------->>>>>>>>//
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ success,errors: errors.array() })
      }

      // check user with alredy exist same Email----->>>>>//
      try {
         let user = await User.findOne({ email: req.body.email });
         if (user) {
            success = false
            return res.status(400).json({ success,error: 'User is already exist with this Email' })
         }
         const salt = await bcrypt.genSalt(10);
         const secPass = await bcrypt.hash(req.body.password, salt)

         // create a new user--->>>>>//

         user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
         })
         const data = {
            user: {
               user: user.id
            }
         }
         const authtoken = jwt.sign(data, JWT_SECRET)
         success = true;

         //console.log(auth_token);
         //res.json(user)
         res.json({success, authtoken })
      } catch (error) {
         console.error(error.message);
         res.status(500).send('Some error occured')
      }
   })

//Route No-----2    Login-User----- Post method---- api/auth/login----->>>>//

router.post('/login', [
   body('email', 'Enter a valid Email').isEmail(),
   body('password', 'Password not be blank').exists()
],
   async (req, res) => {
      let success = false;
      //errors or bad request------->>>>>>>>//
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body;
      try {
         let user = await User.findOne({ email })
         if (!user) {
            
            return res.status(400).json({ error: "Please login with corrrect credentials" })
         }
         const comparePassword = await bcrypt.compare(password, user.password);
         if (!comparePassword) {
            success = false
            return res.status(400).json({ success,error: "Please login with corrrect credentials" })
         }
         const data = {
            user: {
               user: user._id
            }
         }
         const authtoken = jwt.sign(data, JWT_SECRET)
         success = true;
         return res.json({success,authtoken })

      } catch (error) {
         console.error(error.message);
         res.status(500).send(' Internal server error')
      }

   }
)

//Route No-----3  Get User Details------>>>> Post method------ api/auth/getuser------   Login Required//
router.post('/getuser', fetchuser,
   async (req, res) => {

      try {
         //let userid = "_id"
         //console.log(mongoose.Types.ObjectId(userid))
         const userId = req.user;
         console.log(userId, '--->>>');
         const user = await User.findById( userId).select('-password');
         //      if (req.user.id.match(/^[0-9a-fA-F]{24}$/)|| !user) {
         //       return res.status(404).json({message:"not found"})
         //       // Yes, it's a valid ObjectId, proceed with `findById` call.
         //   }
         //res.status(200).json(user)
         console.log(user, '---->>>>>');
         res.send(user)
         //return res.json(user)
      } catch (error) {
         console.error(error.message);
         res.status(500).send(' Internal server error')
      }
   }

)

// router.post('/getuser', fetchuser,  async (req, res) => {

//    try {
//      userId = req.user.id;
//      const user = await User.findById(userId).select("-password")
//      res.send(user)
//      console.log(user,'---->>>');
//    } catch (error) {
//      console.error(error.message);
//      res.status(500).send("Internal Server Error");
//    }
//  })

module.exports = router;