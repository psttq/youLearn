import React, {useState} from 'react';
import styles from "./style.module.css"
import {Button, Col, Divider, Form, Input, Row, Select, Tag, Typography} from "antd";
import CardPreview from "../../components/CardPreview";
import {tags_for_antd_select} from "../../temp/temp";
import axios from "axios";
import {API_URL} from "../../config";
import md5 from "md5";
import {stringToColour} from "../../Utils/utils";

function CreateCardPage(props) {
    const handleSubmit = async (values) => {
        console.log(values);
        axios.post(`${API_URL}/createcard`, {
            title: values.title,
            description: values.description,
            imgUrl: values.imgUrl
        })
            .then(function (response) {
                if (response.status === 200)
                    console.log("SUCCCESSS")
            })
            .catch(function (error) {
                console.log("FAIL")
            });
    }
    const [fieldValues, setFieldValues] = useState({
        title: "Title",
        testCount: 4,
        imgUrl: undefined

    });

    const [a, setA] = useState(1);
    let onFormChanged = (changedFields) => {
        let newFieldValues = {...fieldValues};
        changedFields.forEach(field => {
            newFieldValues[field.name[0]] = field.value;
        })
        newFieldValues.imgUrl = newFieldValues.imgUrl === "" ? undefined : newFieldValues.imgUrl;
        setFieldValues(newFieldValues);
    }
    const tagRender = (props) => {
        const {label, value, closable, onClose} = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={stringToColour(label)}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{marginRight: 3}}
            >
                {label}
            </Tag>
        );
    };

    let selectedTagsSet = new Set();

    return (
        <div className="App-main">
            <div className={styles.createCardContainer}>
                <Row justify={"space-between"} style={{height: "100%"}}>
                    <Col span={11}>
                        <Typography.Text className={styles.previewText}>Создание карточки:</Typography.Text>

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
                                label="Название"
                                name="title"
                                required={true}

                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Описание"
                                name="description"
                                required={true}
                            >
                                <Input.TextArea/>
                            </Form.Item>

                            <Form.Item
                                label="Ссылка на картинку"
                                name="imgUrl"
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Tags"
                                name="tags"
                            >
                                <Select
                                    mode="tags"
                                    showArrow
                                    tagRender={tagRender}
                                    tokenSeparators={[',']}
                                    style={{width: '100%'}}
                                    options={tags_for_antd_select}
                                    // @ts-ignore
                                    onSelect={(value, option) => {
                                        console.log('select', value)
                                        selectedTagsSet.add(value);
                                    }}
                                    // @ts-ignore
                                    onDeselect={(value, option) => {
                                        console.log('deselect', value)
                                        selectedTagsSet.delete(value)
                                    }}
                                />
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                <Button type="primary" htmlType="submit">
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Divider type={"vertical"} orientation={"center"} style={{height: "100%"}}/>
                    <Col span={11}>
                        <Typography.Text className={styles.previewText}>Превью:</Typography.Text>
                        <div className={styles.cardContainer}>
                            <CardPreview title={fieldValues.title} testCount={a} progress={40}
                                         imgUrl={fieldValues.imgUrl}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default CreateCardPage;