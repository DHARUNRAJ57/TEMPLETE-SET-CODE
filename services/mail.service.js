const nodemailer = require("nodemailer");
const ejs = require("ejs");

const { MAIL_BOT_ID, MAIL_BOT_PASSWORD, ADMIN_MAIL_ID, COMPANY_INFO } = require("../auth/credentials")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_BOT_ID,
    pass: MAIL_BOT_PASSWORD,
  },
});

const POST_MAN = async(toEmails, subject, htmlFile) =>{
  const mailOptions = {
    from: MAIL_BOT_ID,
    to: toEmails,
    subject: `${subject} - ${COMPANY_INFO.name}`,
    html: htmlFile
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("MAIL ERROR: ",err.message);
      return { status: 500, error: err.message };
    } else {
      return { status: 200, msg: "Email Sent" };
    }
  })
}

const sendEnquiry = async(data) => {
  try{
    ejs.renderFile(__dirname+"/mail/enquiry.mail.ejs", {data, company: COMPANY_INFO}, (err, htmlFile)=> {
      if(err){
        console.log("MAIL ERROR: ",err.message);
        return { status: 500, error: err.message }
      }else{
        const emails = [ADMIN_MAIL_ID]
        return POST_MAN(emails, `NEW BOOKING - ${data?.bookID}` , htmlFile)
      }
    })
  }catch(err){
    console.log("MAIL ERROR: ",err.message);
    return { status: 500, error: err.message };
  }
}

const sendBooking = async(data) => {
  try{
    ejs.renderFile(__dirname+"/mail/booking.mail.ejs", {data, company: COMPANY_INFO}, (err, htmlFile)=> {
      if(err){
        console.log("MAIL ERROR: ",err.message);
        return { status: 500, error: err.message }
      }else{
        const emails = [ADMIN_MAIL_ID, data?.email]
        return POST_MAN(emails, `NEW BOOKING - ${data?.bookID}`, htmlFile)
      }
    })
  }catch(err){
    console.log("MAIL ERROR: ",err.message);
    return { status: 500, error: err.message };
  }
}

module.exports = {
  sendEnquiry,
  sendBooking
}
