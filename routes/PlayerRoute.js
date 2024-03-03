const express = require("express");
const { addPlayer } = require("../controllers/playerController");
const {
  addPlayerToMatch,
  updatePlayer,
  deletePlayerById,
   getWinLossCount,
  getTopSackPlayers,
  getPlayersByFieldGoalsMade,
  getTotalRushingYardsForMatch,
  getAverageRushingYardsPerPlayer,
  getAllPlayers,
  getPlayerById


} = require("../models/playerModel");

const router = express.Router();
//post request add match status 
//post http://localhost:8080/api/add 
router.post("/add", addPlayer);

//post request add player by match_id 
// http://localhost:8080/api/match_id/player  --replace match_id
router.post("/:matchId/player", async (req, res) => {
  const { matchId } = req.params;
  const playerData = req.body;

  try {
    const match = await addPlayerToMatch(matchId, playerData);
    res.send({ success: true, message: "Player added to match", match });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});
//put request update the player 
//http://localhost:8080/api/match_id/player_id
router.post("/update/:id", async (req, res) => {
  const playerId = req.params.id;
  const playerData = req.body;

  try {
    const result = await updatePlayer(playerId, playerData);
    res.send({ success: true, message: "Player updated successfully", result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


// DELETE /api/Deleate/:_id
router.delete("/Deleate/:id", async (req, res) => {
  const playerId = req.params.id;

  try {
    await deletePlayerById(playerId);
    res.send({ success: true, message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// GET getWinLossCount  /api/win-loss-count
//Count of Wins and Losses
router.get("/win-loss-count", async (req, res) => {
  try {
    const result = await getWinLossCount();
    res.send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// GET /api/top-sack-players
//Finds players who have achieved the highest number of sacks in a single match
router.get("/top-sack-players", async (req, res) => {
  try {
    const result = await getTopSackPlayers();
    res.send({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// Route to get all players
router.get('/players', async (req, res) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a player by ID
router.get('/players/:id', async (req, res) => {
  try {
    const player = await getPlayerById(req.params.id);
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/players-by-field-goals-made
//A List of Players Sorted from Most to Fewest Field Goals Made
router.get("/players-by-field-goals-made", async (req, res) => {
  try {
    const result = await getPlayersByFieldGoalsMade();
    res.send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// POST /api/total-rushing-yards
//In a Match a Player with the Least Rushing Yards
router.post("/total-rushing-yards", async (req, res) => {
  const { matchId } = req.body;

  try {
    const result = await getTotalRushingYardsForMatch(matchId);
    if (result.length === 0) {
      res.status(404).send({ success: false, message: "No matching data found" });
    } else {
      res.send({ success: true, data: result });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// GET /api/average-rushing-yards
//Average Rushing Yards Per Player
router.get("/average-rushing-yards", async (req, res) => {
  try {
    const result = await getAverageRushingYardsPerPlayer();
    res.send({ success: true, data: result });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});
module.exports = router;


