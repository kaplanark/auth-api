const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const auth = require('./routes/auth');
const user = require('./routes/user');
app.use(auth);
app.use(user);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})


require('./config/database').connect();
app.listen(PORT, function () {
    console.log('Server is running on Port: 5000');
});


