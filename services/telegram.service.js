const axios = require('axios').default;

const { TELEGRAM_BOT_ID, TELEGRAM_CHAT_ID } = require("../auth/credentials")

function TelegramService(){
    return {

        sendEnquiry:async (_)=>{
            const message = `New Enquiry:/nBookId: ${_?.bookID}/nName: ${_?.name}/nMobile: +%2B91${_?.mobile}/nFrom: ${_?.pickupLocation}/nTo: ${_?.dropLocation}/nService: ${_?.serviceType}`.replaceAll('/n','%0A')
            const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_ID}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`)
            .catch(err=>{
                console.log("ERROR: ", err.message);
            })
            console.log("SUCCESS: ",_,response?.data);
        },

        sendBooking: async (_)=>{
            const message = `New Booking:/nBookId: ${_?.bookID}/nName: ${_?.name}/nMobile: +%2B91${_?.mobile}/nFrom: ${_?.pickupLocation}/nTo: ${_?.dropLocation}/nService: ${_?.serviceType}/nPickup Date: ${_?.pickupDate}/nPickup Time: ${_?.pickupTime}/nPrice: Rs.${_?.vehicle?.price}/nVehicle: ${_?.vehicle?.cName}/nDistance: ${_?.distance}km/nDuration: ${_?.duration}`.replaceAll('/n','%0A')
            const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_ID}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`)
            .catch(err=>{
                console.log("ERROR: ", err.message);
            })
            console.log("SUCCESS: ",_,response?.data);
        }
    }
}

module.exports = TelegramService;
