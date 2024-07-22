
const router = require("express").Router()

const atob = require("../controller/atob.controller")

router.get("/:id", atob)

module.exports = router