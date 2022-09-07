const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['token'];
    if (!token) {
        res.status(403).send({ message: 'No token provided' });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: 'Unauthorized' });
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
};

module.exports = verifyToken;