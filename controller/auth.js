const User = require('../models/user');
const Token = require('../models/token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// const sendEmail = require("../utils/email");
dotenv.config();

const signIn = async (req, res) => {
    try {
        const { login, password } = req.body;
        const byUsername = await User.findOne({ username: login });
        const byEmail = await User.findOne({ email: login });
        if (byUsername) {
            if (byUsername.isVeryfied) {
                const isPasswordValid = bcrypt.compareSync(password, byUsername.password);
                if (isPasswordValid) {
                    const token = jwt.sign(
                        {
                            id: byUsername._id,
                            email: byUsername.email,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '24h',
                        }
                    );
                    token && res.status(200).send({ success: 'Login success.', userData: byUsername, accessToken: token });
                } else {
                    res.status(201).send({ message: 'Invalid password please try again.' });
                }
            } else {
                res.status(201).send({ message: 'This account is not verified, check your email.' });
            }
        } else if (byEmail) {
            if (byEmail.isVeryfied) {
                const isPasswordValid = bcrypt.compareSync(password, byEmail.password);
                if (isPasswordValid) {
                    const token = jwt.sign(
                        {
                            id: byEmail._id,
                            email: byEmail.email,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '24h',
                        }
                    );
                    token && res.status(200).send({ message: 'Login success.', userData: byEmail, accessToken: token });
                } else {
                    res.status(400).send({ message: 'Invalid password please try again.' });
                }
            }
            else {
                res.status(400).send({ message: 'This account is not verified, check your email.' });
            }
        } else {
            res.status(201).send({ message: 'No such user found.' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong.' });
        console.log(error);
    }
};

const signUp = async (req, res) => {
    try {
        const { name, surname, username, email, password } = req.body;
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            res.status(400).send({ message: 'User already exists' });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await User.create({
                name,
                surname,
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
            });
            const token = jwt.sign(
                {
                    id: newUser._id,
                    email: newUser.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            );
            // token for email verification
            // const newToken = await Token.create({
            //     userId: newUser._id,
            //     token,
            // });
            // send email
            // const options = {
            //     email: newUser.email,
            //     subject: "Verify your email",
            //     text: `${process.env.CLIENT_URL}/verify/${newUser._id}/${token}`
            // }
            // await sendEmail(options);
            // token && newToken && res.status(201).send({ message: 'User account created. Check your email to verify your account.' });
            token && res.status(201).send({ message: 'User account created.', userData: newUser, accessToken: token });

        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            await User.updateOne({ email }, { password: hashedPassword });
            res.status(201).send({ message: 'Password reset' });
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            );
            token && res.status(201).send({ message: 'Reset password', accessToken: token });
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.params;
        const user = await User.findById(userId);
        if (user) {
            const isTokenValid = await Token.findOne({ userId, token });
            if (isTokenValid) {
                await User.updateOne({ _id: userId }, { isVeryfied: true });
                await Token.deleteOne({ userId, token });
                res.status(201).send({ message: 'Email verified' });
            } else {
                res.status(400).send({ message: 'Invalid token' });
            }
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};
// router.get("/api/auth/verify/:id/:token", async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.params.id });
//         if (!user) {
//             res.status(400).send({ message: 'Invalid link' });
//         }
//         const token = await Token.findOne({
//             userId: req.params.id,
//             token: req.params.token,
//         });

//         if (!token) {
//             res.status(400).send({ message: 'Invalid link' });
//         }
//         await User.updateOne({ _id: user._id }, { isVeryfied: true });
//         await Token.deleteOne({ userId: req.params.id });
//         res.status(201).send({ message: 'User verified' });
//     }
//     catch (error) {
//         res.status(500).send({ message: 'Something went wrong' });
//         console.log(error);
//     }
// });

module.exports = {
    signIn,
    signUp,
    resetPassword,
    forgotPassword,
    verifyEmail
};