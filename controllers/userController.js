const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
        res.status(400);
        throw Error("All Fields are mandatory!")
    }
    const userAvialable = await User.findOne({email});
    if (userAvialable) {
        res.status(400);
        throw Error("User already registered!")
    }
    // Hash password
    const hashpassword = await bcrypt.hash(password, 10)
    const  user = await User.create({
        username, email, password: hashpassword
    })
    if (user) {
        
        res.status(201).json({_id: user._id, email: user.email})
    } else {
        res.status(400);
        throw Error("User data is not valid!")
    }
})

//@desc Login a user
//@route POST /api/users/register
//@access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400);
        throw Error("All Fields are mandatory!")
    }
    const user = await User.findOne({email});
    if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401);
            throw Error("User credentials not valid!")
        }
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
        res.status(200).json({accessToken})
    } else {
        res.status(400);
        throw Error("User not registered!")
    }
})


//@desc Get current user info
//@route GET /api/users/register
//@access private

const currentUser = asyncHandler(async (req, res) => {
    // const user = await User.find()
    res.status(200).json(req.user)
})

module.exports = {
    registerUser,
    loginUser,
    currentUser
};