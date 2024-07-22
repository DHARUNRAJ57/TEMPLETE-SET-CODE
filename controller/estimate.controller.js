
// Telegram Service
const TelegramService = require("../services/telegram.service");
const telegram = TelegramService();

// Firebase Service
const firebase = require("../services/firebase.service");

// Mail Service
const mail = require("../services/mail.service");

// Distance Matrix Service
const findDistanceAndTime = require("../services/distance.service");

const estimation = async (req, res) => {

  const { serviceType, service,rentalpackage, outstationService, trip, pickupLocation, dropLocation} = req.body;
  
  let firebaseService = (service == '2' || service == 2 ) && rentalpackage ? rentalpackage : serviceType !== 'One-Way Trip' ? '1' : '0'

  const enquiryData = { 
    serviceType,
    ...req.body,
  }

    let { distance, duration } = await findDistanceAndTime( [pickupLocation], [dropLocation] ).catch((err) => console.log(err));

    const priceDetails = await firebase.getPriceByService(firebaseService);
    //let days = (new Date(dropDate).getTime() - new Date(pickupDate).getTime()) / (1000*3600*24) + 1 || 1;
    console.log("priceDetails",priceDetails)
    // console.log("No. of Days: " + days);
    console.log("Distance: " + distance);

    const vehicles = priceDetails.map((info) => {
      const kmInitial = parseInt(distance);
      const rate = parseInt(info.rate);
      const batta = parseInt(info.betta);
      const isRoundTrip = service == "1" || service == 1;
      let km = isRoundTrip ? kmInitial * 2 : kmInitial;
      let result = 0;
    
      // Calculation
      if (isRoundTrip) {
        km = Math.max(km, 300 );
      } else {
        km = Math.max(km, 130);
      }
    
      //result = km * rate + batta * days;
      result = km * rate + batta ;
      return {
        price: result,
        ...info,
      };
    });

    if (service == "1" || service == 1) {
      distance = Math.max(distance * 2, 300 );
    }
    
    const pick = pickupLocation?.split(",")[0];
    const drop = dropLocation?.split(",")[0];
    const data = {
      ...enquiryData,
      distance,
      // days,
      duration,
      vehicles,
      pick,
      drop,
    };
    console.log("[ESTIMATED DATA]", data);

    res.render('estimation', { data: data ,route:"estimation"})
};


module.exports = estimation
