
const router = require("express").Router()

const estimation = require("../controller/estimate.controller")

router.post("/", estimation)

module.exports = router