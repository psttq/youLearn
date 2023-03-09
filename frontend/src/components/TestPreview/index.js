import React from 'react';
import styles from "./style.module.css";
import {Card, Image, Typography} from "antd";
import AnswerButton from "../AnswerButton";

const {Title, Text} = Typography;


const TestPreview = ({type, question, answers, image}) => {
    return (
        <Card className={styles.TestCard} bodyStyle={{width: "100%", height: "100%"}} >
            <Title level={4}>{question}</Title>
            <div className={styles.ImageContainer}>
            {image && <Image src={image} width={400}/>}
            </div>
                <div className={ type === "qubic" ? styles.QubicAnswers : styles.VerticalAnswers} >
                    {answers.map((text, i) => <AnswerButton text={text} key={i}/>)}
                </div>
        </Card>
    )
};

export default TestPreview;