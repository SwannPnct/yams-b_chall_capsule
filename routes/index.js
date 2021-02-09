var express = require('express');
var router = express.Router();

const BoardModel = require('./db/model');

const emptyBoard = [{name: "Plus", value: null},{name: "Moins", value: null},{name: "Total 2", value: null}];

router.get('/get-score', async (req, res, next) => {
  console.log("oy");
  const player = await BoardModel.findOne({player: req.query.player});
  res.json({scoreboard : player.scoreboard});
});

router.put('/update-score/:player/:new', async (req,res,next) => {
  const findPlayer = await BoardModel.findOne({player: req.params.player});
  if (!findPlayer) {
    const boardCopy = emptyBoard.slice();
    const idx = boardCopy.findIndex(e => e.name === req.body.rowName);
    boardCopy[idx].value = req.body.rowValue;
    const newPlayer = new BoardModel({
      player: req.params.player,
      scoreboard : boardCopy,
    })
    const savedNew = newPlayer.save();
    res.json({savedNew});
  } else if (req.params.new === "new") {
    findPlayer.scoreboard = emptyBoard;
    const savedPlayer = await findPlayer.save();
    res.json({savedPlayer});
  } else {
    const boardCopy = findPlayer.scoreboard.slice();
    const idx = boardCopy.findIndex(e => e.name === req.body.rowName);
    boardCopy[idx].value = req.body.rowValue;
    findPlayer.scoreboard= boardCopy;
    const savedPlayer = await findPlayer.save();
    res.json({savedPlayer});
  }
  
});

module.exports = router;
