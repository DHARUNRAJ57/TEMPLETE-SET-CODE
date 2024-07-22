
const TelegramService = require("../services/telegram.service")
const telegram = TelegramService()

const mail = require("../services/mail.service")
const firebase = require("../services/firebase.service")

const sendBookingInvoice = async(req, res) => {
    const data = req.body?.data

    //await telegram.sendBooking(data)
    //await mail.sendBooking(data)
    await firebase.saveBooking(data)

    res.json({ status: 200, message: "Success Fully Send"})
}

module.exports = {
    sendBookingInvoice
}