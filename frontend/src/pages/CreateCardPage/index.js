import React, {useEffect, useLayoutEffect, useState} from 'react';
import styles from "./style.module.css"
import {Button, Col, Divider, Form, Input, Row, Select, Tag, Typography} from "antd";
import CardPreview from "../../components/CardPreview";
import {tags_for_antd_select} from "../../temp/temp";
import axios from "axios";
import {API_URL} from "../../config";
import md5 from "md5";
import {stringToColour} from "../../Utils/utils";
import {useDispatch} from "react-redux";
import {setNotification} from "../../redux/slices/notificationSlice";
import {useNavigate} from "react-router";

function CreateCardPage(props) {

    const [availableTags, setAvailableTags] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/getalltags`).then(response => {
            console.log(response.data);
            if (availableTags.length === 0) {
                let tags = response.data.map(e => {
                    return {
                        value: e.name
                    }
                });
                setAvailableTags(tags);
            }
        }).catch(() =>
            console.log("Failed to get tags!"));
    }, []);

    const handleSubmit = async (values) => {
        console.log(values);
        values.imgUrl = !values.imgUrl || values.imgUrl === "" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F1_light_blue_flag.svg/2560px-F1_light_blue_flag.svg.png" : values.imgUrl;
        values.tags = !values.tags || values.tags.length === 0 ? ["Пустота"] : values.tags;
        axios.post(`${API_URL}/createcard`, {
            title: values.title,
            description: values.description,
            imgUrl: values.imgUrl,
            tags: values.tags
        })
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(setNotification({
                        notify: true,
                        target: "dashboard",
                        message: "Карточка была успешно создана!",
                        status: "success"
                    }));
                    navigate('/sets');
                }
            })
            .catch(function (error) {
                dispatch(setNotification({
                    notify: true,
                    target: "dashboard",
                    message: "Ошибка во время создании карточки!",
                    status: "error"
                }));
                navigate('/sets');
            });
    }
    const [fieldValues, setFieldValues] = useState({
        title: "Title",
        testCount: 4,
        imgUrl: undefined,
        tags: ["Категория"],
        description: "Описание"
    });

    let onFormChanged = (changedFields) => {
        let newFieldValues = {...fieldValues};
        changedFields.forEach(field => {
            newFieldValues[field.name[0]] = field.value;
        })
        newFieldValues.imgUrl = newFieldValues.imgUrl === "" || !newFieldValues.imgUrl ? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F1_light_blue_flag.svg/2560px-F1_light_blue_flag.svg.png" : newFieldValues.imgUrl;
        newFieldValues.tags = newFieldValues.tags.length === 0 ? ["Пустота"] : newFieldValues.tags;
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
                                initialValue="Название карточки"
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Описание"
                                name="description"
                                required={true}
                                initialValue="Описание"

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
                                label="Категории"
                                name="tags"
                            >
                                <Select
                                    mode="tags"
                                    showArrow
                                    tagRender={tagRender}
                                    tokenSeparators={[',']}
                                    style={{width: '100%'}}
                                    options={availableTags}
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
                            <CardPreview title={fieldValues.title} testCount={69} progress={40}
                                         imgUrl={fieldValues.imgUrl} category={fieldValues.tags[0]}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default CreateCardPage;