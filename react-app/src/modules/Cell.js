import React from 'react';

function Cell(props) {
    
    function handleClickCell() {
        if (props.indexPlayer === null) {
            return;
        }
        props.handleClickCellParent(props.hidden,props.indexValue);
    }

    return (
        
        <td onClick={() => handleClickCell()}>{props.value}</td>
        
    )
}

export default Cell;