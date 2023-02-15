import React, {useEffect, useLayoutEffect, useState} from 'react';
import styles from "./style.module.css"
import {Button, Col, Divider, Form, Input, message, Row, Select, Tag, Typography} from "antd";
import CardPreview from "../../components/CardPreview";
import {tags_for_antd_select} from "../../temp/temp";
import axios from "axios";
import {API_URL} from "../../config";
import md5 from "md5";
import {stringToColour} from "../../Utils/utils";
import {useDispatch} from "react-redux";
import {setNotification} from "../../redux/slices/notificationSlice";
import {useNavigate} from "react-router";
import {useMutation} from "react-query";
import {useParams} from "react-router-dom";

function EditCardPage(props) {
    const {id} = useParams();
    const [availableTags, setAvailableTags] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let selectedTagsSet = new Set();
    const [fieldValues, setFieldValues] = useState({
        title: "Заголовок карточки",
        testCount: 4,
        imgUrl: undefined,
        tags: ["Категория"]
    });

    const getCardMutation = useMutation(() => {
            return axios.post(`${API_URL}/card`, {card_id: id})
                .then(response => response.data)
                .then(data => {
                    const field_values = {
                        title: data.title,
                        testCount: data.test_count,
                        imgUrl: data.img_url,
                        tags: data.tags,
                        description: data.description
                    }
                    selectedTagsSet = data.tags
                    setFieldValues(field_values)
                    return data
                })
        }
    )

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
        getCardMutation.mutate()
    }, []);

    const handleSubmit = async (values) => {
        await axios.post(`${API_URL}/edit_card`, {
            ...fieldValues, id
        })
        message.success('Карточка изменена!')
        getCardMutation.mutate()
    }


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

    return (
        <div className="App-main">
            {getCardMutation.isSuccess &&
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
                                    initialValue={fieldValues.title}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    label="Описание"
                                    name="description"
                                    required={true}
                                    initialValue={fieldValues.description}
                                >
                                    <Input.TextArea/>
                                </Form.Item>

                                <Form.Item
                                    label="Ссылка на картинку"
                                    name="imgUrl"
                                    initialValue={fieldValues.imgUrl}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label="Категории"
                                    name="tags"
                                    initialValue={fieldValues.tags}
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
                                        Сохранить
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
            }
        </div>
    );
}

export default EditCardPage;