const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const passport = require("passport");
const {storage} = require("../config/cloudinary");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

const keysecret = process.env.JWT_SECRET;

const {
    registerUser,
    loginUser,
    getUserInfo
} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req,res) => {
    if(!req.file){
        return res.status(400).json({message: "No file uploaded"})
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
    }`;
    res.status(200).json({imageUrl});
});

//email config
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"wahwint72@gmail.com",
        pass:"myryqwsatdfhcppj"
    }
})

//send email link for reset password
router.post("/sendpasswordlink", async(req, res) => {
    console.log(req.body);

    const {email} = req.body;
    if(!email) {
        res.status(401).json({status:401, message:"Enter Your email"})
    }

    try{
        const userfind = await User.findOne({email:email});
        
        //token generate for reset password
        const token = jwt.sign({_id: userfind._id}, keysecret, {
            expiresIn: "1d"
        });
        userfind.verifytoken = token;
        await userfind.save();

        const setusertoken = await User.findByIdAndUpdate({_id:userfind._id}, {verifytoken:token}, {new:true});

        if(setusertoken){
            const mailOptions = {
                from:"wahwint72@gmail.com",
                to:email,
                subject:"Sending Email For Password Reset",
                text:`This link is valid for 2 minutes https://budgetbee-vsmk.onrender.com/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log("error", error);
                    res.status(401).json({status:401, message:"email not send"})
                }else{
                    console.log("Email sent", info.response);
                    res.status(201).json({status:201, message:"email sent successfully"})
                }
            });
        }
        
    }catch(error){
        res.status(401).json({status:401, message:"Invalid user"})
    }
});

//verify user for forgot password
router.get("/forgotpassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await User.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, keysecret);
        console.log("verifyToken", verifyToken);

        if (validuser && verifyToken._id) {
            res.status(201).json({ status: 201, validuser });
        } else {
            res.status(401).json({ status: 401, message: "User not verified" });
        }

    } catch (error) {
        console.log("Error in token verification:", error.message);
        res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }
});

//change password
router.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    try {
      // Find user by id and token
      const validuser = await User.findOne({ _id: id, verifytoken: token });
  
      if (!validuser) {
        console.log("User not found or token mismatch");
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      }
  
      // Verify JWT token
      const verifyToken = jwt.verify(token, keysecret);
      console.log("Decoded token:", verifyToken);
  
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds of 10
  
      // Update the password with the hashed password
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          password: hashedPassword,
          verifytoken: null 
        },
        { new: true }
      );
  
      console.log("Password updated successfully for:", updatedUser.email);
      res.status(201).json({ status: 201, updatedUser });
  
    } catch (error) {
      console.error("Error in password reset route:", error.message);
      res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }
  });


// Update user profile info (Name)
router.put("/update-profile", protect, async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.fullName = name;
      await user.save();
  
      res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  
// Update user profile picture with cloudinary
router.put("/update-profile-pic", protect, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      user.profileImageUrl = req.file.path; 
    }

    await user.save();
    res.status(200).json({ user });

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
});


// Initial Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    session: false, 
    failureRedirect: "/api/v1/auth/google/failure"
}), (req, res) => {
    const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.redirect(`https://budgetbee-vsmk.onrender.com/google-auth?token=${token}`);
});
router.get("/google/failure", (req, res) => {
    res.status(401).json({ status: 401, message: "Google authentication failed" });
});


module.exports = router;
