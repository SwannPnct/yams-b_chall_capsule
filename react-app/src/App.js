import './App.css';
import React, { useState} from 'react';
import Dice from './modules/Dice';
import Cell from './modules/Cell';

function App() {

  const [nums, setNums] = useState(undefined);
  const [count, setCount] = useState(0);
  const [score, setScore] = useState([{name: "Plus", value: null},{name: "Moins", value: null},{name: "Total 2", value: null}]);
  const [player, setPlayer] = useState("Bobby");
  const [hasChosen, setHasChosen] = useState(false);

  function handleGen() {
    if (count >= 3) {
      return;
    }
    setCount(count +1);
    const array = [];
    if (!nums) {
    for (let i = 0; i < 5; i++) {
      array.push({num: Math.floor(Math.random() * 6 + 1), selected: false});
    }
    setNums(array);
    } else {
      for (let i = 0; i < 5; i++) {
        if (!nums[i].selected) {
          array.push({num: Math.floor(Math.random() * 6 + 1), selected: false});
        } else {
          array.push(nums[i]);
        }
      }
      setNums(array);
    }
  }

  function handleSelection(index) {
    const shallowCopy = [...nums];
    shallowCopy[index].selected = !shallowCopy[index].selected;
    setNums(shallowCopy);
  }

  
  const dices = nums ? nums.map((e,i) => {
      return(
        <Dice num={e.num} handleSelection={handleSelection} index={i} isSelected={e.selected}/>
      )
    }) : ["Such empty.."]
  
  const genScoreboard = () => {
    console.log("gening score");
    console.log(score.length);
    const table = [];
    for (let i = 0; i < score.length ; i++) {
      console.log(score[i].value);
      const row = [];
      row.push(<Cell value={score[i].name}/>)
      row.push(<Cell handleClickCellParent={handleClickScore} indexValue={i} value={score[i].value} hidden={score[i].name}/>)
      
      table.push(<tr>{row}</tr>);
    }
    return table;
  }
  

  let sum = 0;
  if(nums) {
    nums.forEach(e => sum += e.num);
  }

  function handleClickScore(value, indexValue) {
    async function updateScore(val,res) {
      console.log("herefront");
      await fetch('/update-score/'+player+'/nonew', {
        method: "PUT",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: 'rowName='+val+'&rowValue='+res
      })
    }
    if (value === "Plus" || value === "Moins") {
      if (score[indexValue].value) {
        return;
      }
      const copy = [...score];
      copy[indexValue].value = sum;

      updateScore(value,sum);
    

      if (value === "Plus" && copy[indexValue + 1].value) {
        const total = copy[indexValue + 1].value + sum;
        copy[indexValue + 2].value = copy[indexValue + 1].value + sum;
        updateScore("Total 2", total);
      } else if (value === "Moins" && copy[indexValue - 1].value) {
        const total = copy[indexValue - 1].value + sum;
        copy[indexValue + 1].value = copy[indexValue - 1].value + sum;
        updateScore("Total 2", total);
      }
      
      setScore(copy);
      setNums(undefined);
      setCount(0);
    } else {
      return;
    }
   }

   async function handleRecover(bool) {
     if (!bool) {
      await fetch('/update-score/'+player+'/new', {
        method: "PUT",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: ''
      })
      setHasChosen(true);
     } else {
      const boardRaw = await fetch('/get-score?player='+player);
      const boardJson = await boardRaw.json();
      setScore(boardJson.scoreboard);
      setHasChosen(true);
     }
   }
   console.log(score);
  

  const divStyle = {
    display: "flex",
    minWidth : "500px",
    minHeight: "100px"
  }

  if(!hasChosen) {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        Hi {player} <br></br>
        <button onClick={() => handleRecover(true)}>Recover previous board</button>
        <button onClick={() => handleRecover(false)}>New board</button>
      </div>
    )
  } else {
    return (
      <div>
        <h3>Dices</h3>
        <button onClick={() => handleGen()}>Throw dices</button>
        <div style={divStyle}>
        {dices}
        </div>
        Sum : {sum} <br></br>
        Total throws : {count} <br></br>
        {sum === 30 ? "Bravo!" : ""}
        <br></br>
        <br></br>
        <table>
        {genScoreboard()}
        </table>
      </div>
    );
  }

  
}

export default App;
