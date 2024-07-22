const express = require("express");
const app = express();
const firebase = require("./services/firebase.service");
const TelegramService = require('./services/telegram.service');
const mail = require("./services/mail.service");
const telegram = TelegramService()

app.use("/", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/one-way-taxi', express.static('public'))
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// AtoB Routes (SEO)
const atobRoute = require("./routes/atob.routes")
app.use("/one-way-taxi", atobRoute)

app.get("/", async(req, res) => {
  const Tariff = await firebase.getPriceForTariff()
  const RentalPackages = await firebase.getRentalPackage()

  let oneWayCount = 0
  let roundCount = 0  
  let vehiclesCount = 0  

  const oneWay = await Tariff.filter((tariff,index)=>{
    if(tariff.trip == "0" && oneWayCount<=2 ){
      oneWayCount++
      return tariff
    }
  })  
  const round = await Tariff.filter((tariff,index)=>{
    if(tariff.trip == "1" && roundCount<=2 ){
      roundCount++
      return tariff
    }
  })

  const vehicles = await Tariff.filter((obj, index, self) =>{
    if(index === self.findIndex((o) => o.cName === obj.cName) && vehiclesCount<=2){
      vehiclesCount++
      return obj
    }
  })
    
  res.render("index",{
    data : {
      tariff : {
        oneWay : oneWay,
        round : round,
      },
      RentalPackages : await RentalPackages.filter((obj, index, self) =>{
        obj.pack = obj.pack.replace('hrs',' hrs').replace('-',' - ').replace('kms',' kms')
        if(index === self.findIndex((o) => o.pack === obj.pack)) return obj
      }),
      vehicles
    },
    routes : ""
  });
});

const bookingRouter = require("./routes/booking.routes");
app.use("/api", bookingRouter);

const estimateRouter = require("./routes/estimate.routes");
app.use("/estimation", estimateRouter);

const otpRouter = require("./routes/otp.routes");
app.use("/otp", otpRouter);

const pages = [
  "about",
  "service",
  "cities",
  "contact",
  "seo",
  "success",
  "verification",
  "estimation",
];

pages.forEach((page) => {
  app.get(`/${page}`, (req, res) => res.render(page));
});

app.get(`/booking`, async(req, res) =>{
  const RentalPackages = await firebase.getRentalPackage()
  
  res.render("booking",{data:{RentalPackages: await RentalPackages.filter((obj, index, self) =>{
    obj.pack = obj.pack.replace('hrs',' hrs').replace('-',' - ').replace('kms',' kms')
    if(index === self.findIndex((o) => o.pack === obj.pack)) return obj
  }),},routes : "booking"})
});

app.get(`/tariff`, async(req, res) =>{
  const Tariff = await firebase.getPriceForTariff()

  const oneWay = Tariff.filter((tariff)=>tariff.trip == "0")
  const round = Tariff.filter((tariff)=>tariff.trip == "1")

  res.render("tariff",{
    data : {
      tariff : {
        oneWay : oneWay,
        round : round,
      },
    },
    routes : "tariff"
  })
});

app.get(`/vehicles`, async(req, res) =>{
  const Tariff = await firebase.getPriceForTariff()
  const vehicles = await Tariff.filter((obj, index, self) => index === self.findIndex((o) => o.dName === obj.dName) )
  console.log("vehicles",vehicles)

  res.render("vehicles",{
    data : {
      vehicles
    },
    routes : "vehicles"
  })
});

app.post("/contact", async (req, res) => {
  try {
    sendMail(req.body);
    res.status(200).send("Form submitted successfully.");
  } catch (err) {
    res.status(500).send(`Internal Server Error`);
  }
});

app.post("/verification", (req, res) => {  
  const bookID = Math.floor(Math.random() * 1000000 + 1)
  console.log("{...req.body,bookID}",{...req.body,bookID})
  res.render("verification",{data:{...req.body,bookID}});
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/send/booking", async (req, res) => {
  const { data } = req.body
  await telegram.sendBooking(data)
  await mail.sendBooking(data)
  const bookingFbID = await firebase.saveBooking(data)
  res.status(200).json({ msg: "Success Booking", status: 200, bookingFbID })
});

app.use("", (req, res) => {
  res.render("404");
});

module.exports = app;
