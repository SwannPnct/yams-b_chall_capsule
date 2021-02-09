const mongoose = require('mongoose');


const rowSchema = new mongoose.Schema({
    name: String,
    value: Number
})

const boardSchema = new mongoose.Schema({
    player: String,
    scoreboard : [rowSchema],
})

const BoardModel = mongoose.model('yams_score', boardSchema);

module.exports = BoardModel;