import React, {useEffect, useState} from 'react';
import styles from './style.module.css';
import {Link, useParams} from "react-router-dom";
import {useMutation, useQuery} from "react-query";

import {stringToColour} from '../../Utils/utils';

import {Button, Col, Divider, Image, Row, Tag, Typography} from "antd";
import {Space, Table} from "antd/lib";
import axios from "axios";
import {API_URL} from "../../config";
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {useUser} from "../../hooks/useUser()";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser} from "../../redux/slices/userSlice";

const {Title, Text} = Typography;

let columns = [
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
                <Link to={`/test/edit/${record.id}`}>Редактировать</Link>
                <Link>Удалить</Link>
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
    let u = useUser();
    const user = useSelector(selectUser);


    const [card, setCard] = useState({tags: []});
    const [tests, setTests] = useState([]);
    const getCardsMutation = useMutation(['getTestMutation'], (id) => axios.post(`${API_URL}/get_tests`, {
            id: id
        }).then(res => res.data),
        {
            onSuccess: (data) => {
                console.log('test ', data);
                let tests_data = data.map((test, i) => ({
                    key: test.id.toString(),
                    id: i+1,
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

        if(user.user_id !== card.creator_id)
            columns = [
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
            ];

    }, [user])

    function createCard() {
        axios.post(`${API_URL}/create_test`, {
            id
        }).then(() => getCardsMutation.mutate(id))
    }

    const navigate = useNavigate();

    return (
        <div className="App-main">
            <div className={styles.CardContainer}>
                <div className={styles.CardHeader}>
                    <Button type="primary" shape="circle" className={styles.BackButton} onClick={() => navigate(-1)}
                            icon={<LeftOutlined/>}/>
                    <Title>{card.title}</Title>
                </div>

                <div className={styles.CardInfo}>
                    <div className={styles.CardText}>
                        <Text className={styles.CardDescription}>
                            {card.description}
                        </Text>
                        <Text className={styles.CardAuthor}>
                            <span className={styles.CardAuthorText}>Автор:</span> {card.creator_login}
                        </Text>
                    </div>
                    <Image
                        className={styles.CardImage}
                        width={250}
                        src={card.img_url}
                    />

                </div>
                <div className={styles.CardCategories}>
                    <Title level={4}>Категории:</Title>
                    <div className={styles.CardCategoriesContainer}>
                        {card.tags.map((category, i) => <Tag color={stringToColour(category)} key={i}>{category}</Tag>)}
                    </div>
                </div>
                <Divider/>
                <div className={styles.CardTable}>
                    <Row justify="space-between">
                        <Col>
                            <Title level={4}>Тесты:</Title>
                        </Col>
                        {user.user_id === card.creator_id ? <Col>
                            <Button type="primary" onClick={() => createCard()}>Добавить тест</Button>
                        </Col> : <></> }
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