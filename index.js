const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const user = require('./routes/user');
app.use(user);

require('./config/database').connect();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.json());

// app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Credentials", "true");
//     next();
// })

app.listen(PORT, function () {
    console.log('Server is running on Port: 5000');
});

app.get('/api', (req, res) => {
    res.json({ message: 'api is runing' });
});


