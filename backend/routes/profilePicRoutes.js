// routes/profilePicRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // adjust the path to your multer config
const User = require('../models/User'); // adjust the path to your user model

// Upload and update profile picture
router.post('/update/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: req.file.filename },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile picture updated successfully.',
      profilePic: `/uploads/${updatedUser.profilePic}`, // this will be accessible via browser
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
