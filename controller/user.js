const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email,
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: '86400000',
                    }
                );
                token && res.status(200).send({ userData: user, accessToken: token });
            } else {
                res.status(400).send({ message: 'Invalid password' });
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

const signUp = async (req, res) => {
    try {
        const { name, surname, username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
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
                    userId: newUser.id,
                    email: newUser.email,
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '86400000',
                }
            );
            token && res.status(200).send({ message: 'Create new user', accessToken: token });
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
};