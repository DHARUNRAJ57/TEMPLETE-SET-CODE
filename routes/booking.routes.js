const router = require("express").Router()

const { sendBookingInvoice } = require("../controller/booking.controller")
router.post("/booking", sendBookingInvoice)

module.exports = router