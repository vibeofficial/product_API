const userModel = require('../model/user');
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt');
const fs = require('fs');


exports.register = async (req, res) => {
  try {
    const { fullName, email, password, age, phoneNumber } = req.body;
    const file = req.file;
    let response;
    const existEmail = await userModel.findOne({ email: email.toLowerCase() });
    const existPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber });

    if (existEmail || existPhoneNumber) {
      fs.unlinkSync(file.path)
      return res.status(400).json({
        message: 'User already exist'
      })
    };

    if (file && file.path) {
      response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
    };

    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltRound);


    const user = new userModel({
      fullName,
      email,
      password: hashPassword,
      age,
      phoneNumber,
      profilePicture: {
        url: response.secure_url,
        publicId: response.public_id
      }
    });

    await user.save();
    res.status(201).json({
      message: 'Created successfully',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
};


exports.update = async (req, res) => {
  try {
    const { fullName, age } = req.body;
    const { id } = req.params;
    const file = req.file;
    let response;
    const user = await userModel.findById(id);

    if (!user) {
      fs.unlinkSync(file.path);
      return res.status(404).json('User not found')
    };

    if (file && file.path) {
      response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);
    }
    const userData = {
      fullName: fullName ?? user.fullName,
      age: age ?? user.age,
      profilePicture: {
        imageUrl: response?.secure_url,
        publicId: response?.public_id
      }
    };

    const newData = Object.assign(user, userData)
    const update = await userModel.findByIdAndUpdate(user._id, newData, { new: true });

    res.status(200).json({
      message: 'User updated succesfully',
      data: update
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({email: email.toLowerCase()});

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const confirmPassword = await bcrypt.compare(password, user.password);

    if (!confirmPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    res.status(200).json({
      message: 'Login successful',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
};


exports.getOne = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    res.status(200).json({
      message: 'User below',
      data: user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error getting a user: ' + error.message
    })
  }
};