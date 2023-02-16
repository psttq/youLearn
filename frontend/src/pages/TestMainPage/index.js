import React, {useEffect, useState} from 'react';
import styles from "./style.module.css";
import Test from "../../components/Test";
import {Button, Progress, Typography} from "antd";
import {useMutation} from "react-query";
import axios from "axios";
import {API_URL} from "../../config";
import {useParams} from "react-router-dom";

const {Title, Text} = Typography;
const TestMainPage = (props) => {

    const {id: attempt_id} = useParams();
    const [currentTest, setCurrentTest] = useState({});
    const [attempt, setAttempt] = useState({});
    const [currentTestNumber, setCurrentTestNumber] = useState(0);

    const getTestMutation = useMutation((test_id) => {
        console.log(test_id)
        return axios.post(`${API_URL}/gettest`, {test_id: test_id}).then(res => {
            console.log(res.data);
            setCurrentTest(res.data);
        }).catch(err => {
        });
    });

    const getAttemptMutation = useMutation(()=>{
        axios.post(`${API_URL}/getattempt`, {attempt_id}).then(res => {
            setAttempt(res.data);
            setCurrentTest(res.data.current_test)
        }).catch(err => {
        });
    })

    useEffect(() => {
        getAttemptMutation.mutate();
    }, []);

    useEffect(() => {
        if(attempt.tests_id)
            getTestMutation.mutate(attempt.tests_id[currentTestNumber].id);
    }, [currentTestNumber, attempt]);

    return (
        <div className="App-main">
            <div className={styles.TestContainer}>
                {getAttemptMutation.isLoading ? <></>:  <><Title>{attempt.title}</Title>
                    <div className={styles.ButtonsContainer}>
                    <Button danger ghost>Назад</Button>
                    <Button danger ghost>Пропустить</Button>
                    </div>
                    <Progress style={{marginTop: 40}} percent={attempt.progress} status="active" strokeColor={{from: '#108ee9', to: '#87d068'}}/>
                    <div className={styles.TestBox}>
                {getTestMutation.isLoading ? <></> : <Test type={currentTest.type} question={currentTest.question}
                    answers={currentTest.answers ? currentTest.answers.map(answer => answer.text): []}/>}
                    </div></>}
            </div>
        </div>
    )
};

export default TestMainPage;