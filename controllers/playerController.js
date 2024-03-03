const {addPlayers} = require("../models/playerModel");
const addPlayer = async (req, res) => {
    try {
        addPlayers(req.body);
        res.send({ success: true, message: "added new Player" });
    } catch (err) {
        res.status(500).send({ success: false, message: "Player not added" });
    }
};
module.exports = {
    addPlayer,
};