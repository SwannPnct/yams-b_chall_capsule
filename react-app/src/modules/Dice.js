import React from 'react';

function Dice(props) {
    
    const diceStyle = {
        border : props.isSelected ? "3px solid green" : "2px solid black",
        backgroundColor : props.isSelected ? "lightgreen" : "white",
        borderRadius : "45%",
        padding: "10px",
        fontWeight: "700"
    }
    const divStyle = {
        margin: "26px",
    }

    function handleClick() {
        props.handleSelection(props.index);
    }

    return (
        <div style={divStyle}>
            <span style={diceStyle} onClick={() => handleClick()}>
            {props.num}
            </span>
            
        </div>
    )
}

export default Dice;