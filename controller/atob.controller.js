
const findDistanceAndTime = require("../services/distance.service")
const atob = async (req,res) => {
    const [origin,,destination] = req.params?.id?.split("-")
    const distanceResponse =  await findDistanceAndTime(origin, destination)
    let distance = Math.max(distanceResponse?.distance, 130)
    const data = {
        ...distanceResponse,
        sedanPrice: (distance*14)+400,
        suvPrice: (distance*18)+500,
    }
    res.render("seo", { data })
}

module.exports = atob