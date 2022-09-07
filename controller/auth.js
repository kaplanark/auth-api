const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
                            id: byUsername.id,
                            email: byUsername.email,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '24h',
                        }
                    );
                    token && res.status(200).send({ success: 'Login success', userData: byUsername, accessToken: token });
                } else {
                    res.status(201).send({ message: 'Invalid password' });
                }
            } else {
                res.status(201).send({ message: 'User not verified' });
            }
        } else if (byEmail) {
            if (byEmail.isVeryfied) {
                const isPasswordValid = bcrypt.compareSync(password, byEmail.password);
                if (isPasswordValid) {
                    const token = jwt.sign(
                        {
                            id: byEmail.id,
                            email: byEmail.email,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '24h',
                        }
                    );
                    token && res.status(200).send({ message: 'Login success', userData: byEmail, accessToken: token });
                } else {
                    res.status(400).send({ message: 'Invalid password' });
                }
            }
            else {
                res.status(400).send({ message: 'User not verified' });
            }
        } else {
            res.status(201).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
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
            const newUser = new User({
                name,
                surname,
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
            });
            await newUser.save();
            const token = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            );
            token && res.status(201).send({ message: 'Create new user', accessToken: token });
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
                    userId: user.id,
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

module.exports = {
    signIn,
    signUp,
    resetPassword,
    forgotPassword
};