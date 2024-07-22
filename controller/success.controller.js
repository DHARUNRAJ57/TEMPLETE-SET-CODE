
const db = require("../config/firebase.config").firestore()

const confirmation = async(req, res) =>{
    const docId = req.query.id || "test"
    const data = await (await db.collection("booking").doc(docId).get()).data()
    console.log(data);
    res.render("success", {data})
}

module.exports = confirmation