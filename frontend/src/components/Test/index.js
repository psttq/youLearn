import React from 'react';
import styles from "./style.module.css";
import { Card, Typography} from "antd";
import AnswerButton from "../AnswerButton";

const {Title, Text} = Typography;

const answers = ["Хз", "Что здесь происходит?", "z=x+yi", "Мамка твоя"]

const Test = ({type}) => {
    console.log(type)
    return (
        <Card className={styles.TestCard} bodyStyle={{width: "100%", height: "100%"}} >
            <Title level={4}>Что такое комплексное число?</Title>
                <div className={ type === "qubic" ? styles.QubicAnswers : styles.VerticalAnswers} >
                    {answers.map((text, i) => <AnswerButton text={text} key={i}/>)}
                </div>

        </Card>
    )
};

export default Test;