import React, {useEffect, useState} from 'react';
import styles from "./style.module.css";
import Test from "../../components/Test";
import {Button, Form, Input, Progress, Radio, Select, Typography} from "antd";
import TestPreview from "../../components/TestPreview";
import {tags_for_antd_select} from "../../temp/temp";
import axios from "axios";
import {API_URL} from "../../config";
import {RiLayoutGridLine, RiLayoutRowLine} from "react-icons/ri";
import {useParams} from "react-router-dom";

const {Title, Text} = Typography;
const TestEditPage = (props) => {
    let {id} = useParams();

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

    useEffect(() => {
        //get test by id and id in body of request
        axios.post(`${API_URL}/gettest`, {test_id: id}).then(res => {
            console.log(res);
            let newFieldValues = {...fieldValues};
            newFieldValues.question = res.data.question
            newFieldValues.answers = res.data.answers.map(answer => answer.text);
            newFieldValues.type = res.data.type === 0 ? "qibic" : "vertical";
            setFieldValues(newFieldValues);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const handleSubmit = async (values) => {
        values.test_id = id;
        axios.post(`${API_URL}/updatetest`, values).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
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
            <div className={styles.TestContainer}>
                <Title>Редактирование теста</Title>
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

                        >
                            <Input.TextArea/>
                        </Form.Item>

                        <Form.Item
                            label="Правильный ответ"
                            name={["answer", 0]}
                            required={true}
                        >
                            <Input.TextArea/>
                        </Form.Item>

                        <Form.Item
                            label="Ответ 2"
                            name={["answer", 1]}
                            required={true}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item
                            label="Ответ 3"
                            name={["answer", 2]}
                            required={true}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item
                            label="Ответ 4"
                            name={["answer", 3]}
                            required={true}
                        >
                            <Input.TextArea/>
                        </Form.Item>

                        <Form.Item label="Отображение" name="type">
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
                    <TestPreview type={fieldValues.type} question={fieldValues.question} answers={fieldValues.answers}/>
                </div>
            </div>
        </div>
    )
};

export default TestEditPage;