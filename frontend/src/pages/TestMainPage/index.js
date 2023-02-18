import React, {useEffect, useState} from 'react';
import styles from "./style.module.css";
import Test from "../../components/Test";
import {Button, Progress, Typography} from "antd";
import {useMutation} from "react-query";
import axios from "axios";
import {API_URL} from "../../config";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {notification} from "antd/lib";
import {ClipLoader} from "react-spinners";

const {Title, Text} = Typography;
const TestMainPage = (props) => {

    const navigate = useNavigate();
    const {id: attempt_id} = useParams();
    const [currentTest, setCurrentTest] = useState({});
    const [attempt, setAttempt] = useState({});
    const [currentTestNumber, setCurrentTestNumber] = useState(0);
    const [isFinished, setFinished] = useState(false);

    const getTestMutation = useMutation((test_id) => {
        console.log(test_id)
        if(test_id === undefined)
            return;
        return axios.post(`${API_URL}/gettest`, {test_id: test_id}).then(res => {
            console.log(res.data);
            setCurrentTest(res.data);
        }).catch(err => {
        });
    });

    const getAttemptMutation = useMutation(() => {
        axios.post(`${API_URL}/getattempt`, {attempt_id}).then(res => {
            setAttempt(res.data);
            setCurrentTestNumber(res.data.current_test)
            if(res.data.is_finished)
                setFinished(true);
        }).catch(err => {
        });
    })

    useEffect(() => {
        getAttemptMutation.mutate();
    }, []);

    useEffect(() => {
        if(attempt === {})
            return;
        console.log(attempt)
        if (attempt?.tests_id)
            getTestMutation.mutate(attempt.tests_id[currentTestNumber]?.id);
    }, [currentTestNumber, attempt]);


    const answerButtonClicked = (answer_id) => {
        console.log(currentTestNumber, currentTest.answers.length);
        axios.post(`${API_URL}/attemptanswer`, {attempt_id, test_id: currentTest.id, answer_id}).then((res) => {
                if (res.status === 200) {
                    if (currentTestNumber+1 === attempt.tests_id.length) {
                        setFinished(true);
                        return;
                    }
                    setCurrentTestNumber(currentTestNumber + 1);
                }
            else
                {
                    navigate("/current")
                    notification.error({
                        message: `Ошибка`,
                        description:
                            "Произошла ошибка при принятии ответа",
                        placement: "bottomRight",
                    });
                }
            }
        ).catch(() => {
            navigate("/current");
            notification.error({
                message: `Ошибка`,
                description:
                    "Произошла ошибка при принятии ответа",
                placement: "bottomRight",
            });
        })
    }

    return (
        <div className="App-main">
            {isFinished ? <div className={styles.FinishedContainer}>  <Title>Текст закончен! </Title>
            <Button type="primary" onClick={() => navigate('/results')} >К результату</Button></div> : <div className={styles.TestContainer}>
                {getAttemptMutation.isLoading ? <div className={styles.LoaderContainer}><ClipLoader size={70}/></div> : <><Title>{attempt.title}</Title>
                    <div className={styles.ButtonsContainer}>
                        <Button danger ghost>Назад</Button>
                        <Button danger ghost>Пропустить</Button>
                    </div>
                    <Progress style={{marginTop: 40}} percent={currentTestNumber/attempt.tests_id?.length*100} status="active"
                              strokeColor={{from: '#108ee9', to: '#87d068'}}/>
                    <div className={styles.TestBox}>
                        {getTestMutation.isLoading ? <div className={styles.LoaderContainer}><ClipLoader size={70}/></div> :
                            <Test type={currentTest.type} question={currentTest.question} onClick={answerButtonClicked}
                                  answers={currentTest.answers ? currentTest.answers : []}/>}
                    </div>
                </>}
            </div>}
        </div>
    )
};

export default TestMainPage;