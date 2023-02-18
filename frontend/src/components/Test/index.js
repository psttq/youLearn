import React from 'react';
import styles from "./style.module.css";
import { Card, Typography} from "antd";
import AnswerButton from "../AnswerButton";

const {Title, Text} = Typography;

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


const Test = ({type, question, answers, onClick}) => {
    shuffle(answers);
    return (
        <Card className={styles.TestCard} bodyStyle={{width: "100%", height: "100%"}} >
            <Title level={4}>{question}</Title>
            <div className={ type === "qubic" ? styles.QubicAnswers : styles.VerticalAnswers} >
                {answers.map((answer, i) => <AnswerButton text={answer.text} id={answer.id} key={answer.id} onClick={(id)=>onClick(id)}/>)}
            </div>
        </Card>
    )
};


export default Test;