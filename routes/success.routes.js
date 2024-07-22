const router = require("express").Router()
const successController = require("../controller/success.controller")

router.get("/", successController)

module.exports  = router