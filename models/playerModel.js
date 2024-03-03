const mongoose = require("mongoose");
const playerModel = mongoose.model("usa_soccer_stats");
const addPlayerToMatch = async (matchId, playerData) => {
  try {
    const match = await playerModel.findOne({ match_id: matchId });
    if (!match) {
      throw new Error("Match not found");
    }

    match.players.push(playerData);
    await match.save();
    return match;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addPlayers = (data) => {
  playerModel.insertMany([data]);

}

const updatePlayer = (id, data) => {
  return playerModel.updateOne({ _id: id }, data);
}
const deletePlayerById = async (playerId) => {
  try {
    const result = await playerModel.deleteOne({ _id: playerId });
    if (result.deletedCount === 0) {
      throw new Error("Player not found");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
//Count of Wins and Losses
const getWinLossCount = async () => {
  try {
    const result = await playerModel.aggregate([
      { $group: { _id: "$result", count: { $sum: 1 } } }
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Finds players who have achieved the highest number of sacks in a single match
const getTopSackPlayers = async () => {
  try {
    const result = await playerModel.aggregate([
      { $unwind: "$players" },
      { $group: { _id: { players_name: "$players.name" }, maxSacks: { $max: "$players.sacks" } } },
      { $project: { players_name: "$_id.players_name", maxSacks: "$maxSacks", _id: 0 } },
      { $sort: { maxSacks: -1 } },
      { $limit: 5 }
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
//A List of Players Sorted from Most to Fewest Field Goals Made
const getPlayersByFieldGoalsMade = async () => {
  try {
    const result = await playerModel.aggregate([
      { $unwind: "$players" },
      { $group: { _id: { players_name: "$players.name" }, totalFieldGoalsMade: { $sum: "$players.field_goals.made" } } },
      { $project: { players_name: "$_id.players_name", totalFieldGoalsMade: "$totalFieldGoalsMade", _id: 0 } },
      { $sort: { totalFieldGoalsMade: -1 } }
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
//In a Match a Player with the Least Rushing Yards
const getTotalRushingYardsForMatch = async (matchId) => {
  try {
    const result = await playerModel.aggregate([
      { $unwind: "$players" },
      { $match: { "players.rushing_yards": { $gt: 0 }, match_id: matchId } },
      { $group: { _id: { players_name: "$players.name" }, totalRushingYards: { $sum: "$players.rushing_yards" } } },
      { $project: { players_name: "$_id.players_name", totalRushingYards: "$totalRushingYards", _id: 0 } },
      { $sort: { totalRushingYards: 1 } },
      { $limit: 1 }
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
//Average Rushing Yards Per Player
const getAverageRushingYardsPerPlayer = async () => {
  try {
    const result = await playerModel.aggregate([
      { $unwind: "$players" },
      { $group: { _id: { players_name: "$players.name" }, averageRushingYards: { $avg: "$players.rushing_yards" } } },
      { $project: { players_name: "$_id.players_name", averageRushingYards: "$averageRushingYards", _id: 0 } },
      { $sort: { averageRushingYards: -1 } }
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllPlayers = async () => {
  try {
    const players = await playerModel.find({});
    return players;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getPlayerById = async (id) => {
  try {
    const player = await playerModel.findById(id);
    if (!player) {
      throw new Error("Player not found");
    }
    return player;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  addPlayers,
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
};