const express = require('express');
const route = express.Router();

const { sendOtp, verifyOtp } = require("../controller/otp.controller")

route.get('/:token', (req, res) => {
    res.render('otp');
})

route.post("/send", sendOtp)
route.post("/verify", verifyOtp)

module.exports = route