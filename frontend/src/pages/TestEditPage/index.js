import React, {useEffect, useState} from 'react';
import styles from "./style.module.css";
import {Button, Form, Input, notification, Progress, Radio, Select, Typography} from "antd";
import TestPreview from "../../components/TestPreview";
import axios from "axios";
import {API_URL} from "../../config";
import {RiLayoutGridLine, RiLayoutRowLine} from "react-icons/ri";
import {useNavigate, useParams} from "react-router-dom";
import {ClockLoader} from "react-spinners";
import {useMutation} from "react-query";

import {LeftOutlined} from "@ant-design/icons";


const {Title, Text} = Typography;
const TestEditPage = (props) => {
    let {id} = useParams();
    let navigate = useNavigate();

    const [fieldValues, setFieldValues] = useState({
        question: "Новый тест",
        answers: [
            "Ответ 1",
            "Ответ 2",
            "Ответ 3",
            "Ответ 4"
        ]
        ,
        type: "qubic"

    });

    const getTestMutation = useMutation((test_id) => {
        return axios.post(`${API_URL}/gettest`, {test_id: test_id}).then(res => {
            let newFieldValues = {...fieldValues};
            newFieldValues.question = res.data.question
            newFieldValues.image = res.data.image
            newFieldValues.answers = res.data.answers.map(answer => answer.text);
            newFieldValues.type = res.data.type === 0 ? "qubic" : "vertical";
            setFieldValues(newFieldValues);
        }).catch(err => {
        });
    });

    useEffect(() => {
        getTestMutation.mutate(id);
    }, []);

    const handleSubmit = async (values) => {
        values.test_id = id;
        axios.post(`${API_URL}/updatetest`, values).then(res => {
            notification.success({
                message: `Успех`,
                description:
                "Тест успешно обновлен",
                placement: "bottomRight",
            });
        }).catch(err => {
            notification.error({
                message: `Ошибка`,
                description:
                "Произошла ошибка при обновлении теста",
                placement: "bottomRight",
            });
        })
    }


    let onFormChanged = (changedFields) => {
        let newFieldValues = {...fieldValues};
        changedFields.forEach(field => {
            if (field.name[0] === "answer") {
                newFieldValues["answers"][field.name[1]] = field.value;
            } else
                newFieldValues[field.name[0]] = field.value;
        })
        setFieldValues(newFieldValues);
    }

    return (
        <div className="App-main">
            {getTestMutation.isLoading ? <div className={styles.Loader}><ClockLoader/></div> :
                <div className={styles.TestContainer}>
                    <div className={styles.TestHeader}>
                        <Button type="primary" shape="circle" className={styles.BackButton} onClick={() => navigate(-1)}
                                icon={<LeftOutlined/>}/>
                        <Title>Редактирование теста</Title>
                    </div>
                    <div>
                        <Form
                            style={{marginTop: 30}}
                            onFieldsChange={onFormChanged}
                            name="basic"
                            layout={window.innerWidth < 800 ? 'vertical' : 'horizontal'}
                            labelCol={{span: 8}}
                            wrapperCol={{span: 12}}
                            validateTrigger="onChange"
                            autoComplete="off"
                            onFinish={handleSubmit}
                        >

                            <Form.Item
                                label="Вопрос"
                                name="question"
                                required={true}
                                initialValue={fieldValues.question}
                            >
                                <Input.TextArea/>
                            </Form.Item>

                            <Form.Item
                                label="Картинка"
                                name="image"
                                required={true}
                                initialValue={fieldValues.image}
                            >
                                <Input.TextArea/>
                            </Form.Item>

                            <Form.Item
                                label="Правильный ответ"
                                name={["answer", 0]}
                                required={true}
                                initialValue={fieldValues.answers[0]}
                            >
                                <Input.TextArea/>
                            </Form.Item>

                            <Form.Item
                                label="Ответ 2"
                                name={["answer", 1]}
                                required={true}
                                initialValue={fieldValues.answers[1]}
                            >
                                <Input.TextArea/>
                            </Form.Item>
                            <Form.Item
                                label="Ответ 3"
                                name={["answer", 2]}
                                required={true}
                                initialValue={fieldValues.answers[2]}
                            >
                                <Input.TextArea/>
                            </Form.Item>
                            <Form.Item
                                label="Ответ 4"
                                name={["answer", 3]}
                                required={true}
                                initialValue={fieldValues.answers[3]}
                            >
                                <Input.TextArea/>
                            </Form.Item>

                            <Form.Item label="Отображение" name="type" initialValue={fieldValues.type}>
                                <Radio.Group>
                                    <Radio.Button value="qubic"><RiLayoutGridLine/></Radio.Button>
                                    <Radio.Button value="vertical"><RiLayoutRowLine/></Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                <Button type="primary" htmlType="submit">
                                    Сохранить
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.TestBox}>
                        <Title level={3}>Превью:</Title>
                        <TestPreview type={fieldValues.type} question={fieldValues.question}
                                     answers={fieldValues.answers} image={fieldValues.image}/>
                    </div>
                </div>}
        </div>
    )
};

export default TestEditPage;