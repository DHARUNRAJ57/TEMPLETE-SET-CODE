const axios = require('axios')
var CryptoJS = require("crypto-js");

const SMS_TOKEN = "tXGFnAr4LNYZM8Q9jwPVHxWdvs6eahl2qk5of7SzpRbOUEumITTnoiOFHqdCLhzJPgaxer2mpZ8UNEyf"
const OTP_SECERT = "muralitrssuperstar"

const { COMPANY_INFO } = require("../auth/credentials")
const WEBSITE_NAME = COMPANY_INFO.website

function SMSService(){
    return {
        sendOtp: async (mobile)=>{
            const otp = Math.floor(Math.random() * 1000000 + 1);
            console.log("OTP To Check");
            console.log(otp);
            var token = CryptoJS.AES.encrypt(otp.toString(), OTP_SECERT).toString();
            const otpData = await axios.get(
                `https://www.fast2sms.com/dev/bulkV2?authorization=${SMS_TOKEN}&route=dlt&sender_id=SMSTRS&message=154911&variables_values=${otp}%7CFor%20${WEBSITE_NAME}%7C&flash=0&numbers=${mobile}`
            )
            .catch((err) => {
                console.log(err)
            });
            return token;
        },
        sendSucess: ()=>{
             
        },
        verifyOTP: ({otp, token})=> {
            var bytes = CryptoJS.AES.decrypt(token, OTP_SECERT);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText == otp;
        }
    }
}

module.exports = SMSService