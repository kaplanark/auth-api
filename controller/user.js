const User = require('../models/user');
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId, { password: 0 });
        if (user) {
            res.status(201).send({ userData: user });
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, surname, username, email } = req.body;
        const user = await User.findById(req.userId);
        if (user) {
            await User.updateOne({ _id: req.userId }, { name, surname, username, email });
            res.status(201).send({ message: 'User updated' });
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            await User.deleteOne({ _id: req.userId });
            res.status(201).send({ message: 'User deleted' });
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
    getUser,
    updateUser,
    deleteUser,
};