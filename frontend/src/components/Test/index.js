import React from 'react';
import styles from "./style.module.css";
import { Card, Typography} from "antd";
import AnswerButton from "../AnswerButton";

const {Title, Text} = Typography;


const Test = ({type, question, answers}) => {
    return (
        <Card className={styles.TestCard} bodyStyle={{width: "100%", height: "100%"}} >
            <Title level={4}>{question}</Title>
            <div className={ type === "qubic" ? styles.QubicAnswers : styles.VerticalAnswers} >
                {answers.map((text, i) => <AnswerButton text={text} key={i}/>)}
            </div>
        </Card>
    )
};


export default Test;