import React from 'react';
import styles from "./style.module.css";
import Test from "../../components/Test";
import {Button, Progress, Typography} from "antd";

const {Title, Text} = Typography;
const TestMainPage = (props) => {
    return (
        <div className="App-main">
            <div className={styles.TestContainer}>
                <Title>Комплексные числа</Title>
                <div className={styles.ButtonsContainer}>
                    <Button danger ghost>Назад</Button>
                    <Button danger ghost>Пропустить</Button>
                </div>
                <Progress style={{marginTop: 40}} percent={45} status="active" strokeColor={{from: '#108ee9', to: '#87d068'}}/>
                <div className={styles.TestBox}>
                    <Test type="1"/>
                </div>
            </div>
        </div>
    )
};

export default TestMainPage;