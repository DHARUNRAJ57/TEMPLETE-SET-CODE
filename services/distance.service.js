// const distance = require("google-distance-matrix");

// distance.key("AIzaSyBzKJ9azZXIY6omjVVxoxwwwiO_qKbwawc");
// distance.units("metric");

// function findDistanceAndTime(origins, destinations) {
//   return new Promise((resolve, reject) => {
//     distance.matrix(origins, destinations, function (err, distances) {
//       if (err) {
//         reject(err);
//       }
//       if (!distances) {
//         reject(err);
//       }
//       console.log(distances);
//       if (distances.status == "OK") {
//         for (var i = 0; i < origins.length; i++) {
//           for (var j = 0; j < destinations.length; j++) {
//             var origin = distances.origin_addresses[i];
//             var destination = distances.destination_addresses[j];
//             if (distances.rows[0].elements[j].status == "OK") {
//               var distance = distances.rows[i].elements[j].distance.text;
//               var duration = distances.rows[i].elements[j].duration.text;
//               km = parseFloat(distance.split(" ")[0].replace(/,/g, ""));
//               resolve({ distance: km, duration: duration });
//             } else {
//               reject(destination + " is not reachable by land from " + origin);
//             }
//           }
//         }
//       } else {
//         reject("Distance matrix api not working");
//       }
//     });
//   });
// }

// module.exports = findDistanceAndTime;



const axios = require("axios")

async function findDistanceAndTime(origin, destination) {
  try{
    const response = await axios.get(`https://maps.thereciprocalsolutions.com/distance-matrix?origin=${origin}&destination=${destination}`)
    const data = {
        ...response?.data?.trip,
        origin,
        destination
    }
    return data
  }catch(err){
    return err.message
  }
}

module.exports = findDistanceAndTime;