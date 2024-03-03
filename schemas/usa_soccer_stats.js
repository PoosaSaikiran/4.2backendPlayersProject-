const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name: String,
    rushing_yards: Number,
    touchdowns_thrown: Number,
    sacks: Number,
    field_goals: {
      made: Number,
      missed: Number
    },
    catches_made: Number
  });

  const matchSchema = new mongoose.Schema({
    match_id: String,
    league_name: String,
    date: String,
    opponent: String,
    result: String,
    players: [playerSchema]
  });

  module.exports = mongoose.model('usa_soccer_stats', matchSchema);