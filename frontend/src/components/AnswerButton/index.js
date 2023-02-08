import React from 'react';
import styles from './style.module.css'
import {stringToColour} from "../../Utils/utils";

const AnswerButton = ({id, text, onClick}) => {
    let color = "white";
    let borderColor = "#ff8033";
    return (
        <div className={styles.AnswerButton} style={{background: color, borderColor: borderColor}}
             onClick={() => onClick(id)}>
            {text}
        </div>
    )
};

export default AnswerButton;