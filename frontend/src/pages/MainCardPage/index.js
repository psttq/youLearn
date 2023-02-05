import React, {useEffect, useState} from 'react';
import styles from './style.module.css';
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "react-query";

import {stringToColour} from '../../Utils/utils';

import {Button, Col, Divider, Image, Row, Tag, Typography} from "antd";
import {Space, Table} from "antd/lib";
import axios from "axios";
import {API_URL} from "../../config";

const {Title, Text} = Typography;

const columns = [
    {
        title: 'Номер',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Вопрос',
        dataIndex: 'question',
        key: 'question',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Редактировать</a>
                <a>Удалить</a>
            </Space>
        ),
    },
];
// const data = [
//     {
//         key: '1',
//         id: 1,
//         question: 'Что такое комплексное число?',
//     },
//     {
//         key: '2',
//         id: 2,
//         question: 'По какой формуле считать сумму комплексного числа?',
//     },
//     {
//         key: '3',
//         id: 3,
//         question: 'Что такое комплексная плоскость?',
//     },
// ];

const exampleCategories = ["Математика", "Комплексные числа", "Введение в комплексный анализ", "ТФКП"]

const MainCardPage = () => {
    let {id} = useParams();
    const [card, setCard] = useState({tags: []});
    const [tests, setTests] = useState([]);
    const getCardsMutation = useMutation(['getTestMutation'], (id) => axios.post(`${API_URL}/get_tests`, {
            id: id
        }).then(res => res.data),
        {
            onSuccess: (data) => {
                console.log('test ', data);
                let tests_data = data.map((test) => ({
                    key: test.id.toString(),
                    id: test.id,
                    question: test.question
                }))
                setTests(tests_data)
                return tests_data;
            }
        });


    useEffect(() => {
        getCardsMutation.mutate(id);
        axios.post(`${API_URL}/card`, {
            card_id: id
        }).then(res => res.data).then(data => {
            console.log(data);
            setCard(data)
        })
    }, [])

    function createCard() {
        axios.post(`${API_URL}/create_test`, {
            id
        }).then(() => getCardsMutation.mutate(id))
    }

    return (
        <div className="App-main">
            <div className={styles.CardContainer}>
                <Title>{card.title}</Title>
                <div className={styles.CardInfo}>
                    <Text className={styles.CardDescription}>
                        {card.description}
                    </Text>
                    <Image
                        className={styles.CardImage}
                        width={250}
                        src={card.img_url}
                    />
                </div>
                <div className={styles.CardCategories}>
                    <Title level={4}>Категории:</Title>
                    <div className={styles.CardCategoriesContainer}>
                        {card.tags.map((category) => <Tag color={stringToColour(category)}>{category}</Tag>)}
                    </div>
                </div>
                <Divider/>
                <div className={styles.CardTable}>
                    <Row justify="space-between">
                        <Col>
                            <Title level={4}>Тесты:</Title>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={() => createCard()}>Добавить тест</Button>
                        </Col>
                    </Row>
                    <div className={styles.TableContainer}>
                        <Table columns={columns} loading={getCardsMutation.isLoading}
                               dataSource={getCardsMutation.isSuccess ? tests : []}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainCardPage;