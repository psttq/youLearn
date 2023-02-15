import React, {useEffect, useState} from 'react';
import styles from './style.module.css';
import {Link, useParams, useSearchParams} from "react-router-dom";
import {useMutation, useQuery} from "react-query";

import {stringToColour} from '../../Utils/utils';

import {Button, Col, Divider, Dropdown, Image, Modal, Row, Tag, Typography} from "antd";
import {notification, Space, Table} from "antd/lib";
import axios from "axios";
import {API_URL} from "../../config";
import {DownOutlined, LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {useUser} from "../../hooks/useUser()";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser} from "../../redux/slices/userSlice";
import queryString from 'query-string';
import {selectNotifications, setNotification} from "../../redux/slices/notificationSlice";

const {Title, Text} = Typography;

const authorItems = [
    {
        label: 'Редактировать',
        key: '1',
    },
    {
        label: 'Удалить',
        key: '2',
    },
];

const userItems = [
    {
        label: 'Добавить к себе',
        key: '3',
    },
];



let classicColumns = [
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
    }
];
// const data = [
// {
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
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const handleMenuClick = ({key}) => {
        if(key ==='1'){
            navigate(`/card/edit/${id}`)
        }
        if (key === '2') {
            Modal.confirm({
                title: 'Вы уверены, что хотите удалить эту карточку?',
                content: 'Это действие необратимо',
                okText: 'Удалить',
                cancelText: 'Отмена',
                onOk: () => {
                    axios.post(`${API_URL}/delete_card`, {card_id: id}).then(res => {
                        if (res.status === 200) {
                            dispatch(setNotification({
                                notify: true,
                                target: "dashboard",
                                message: "Карточка была успешно удалена!",
                                status: "success"
                            }));
                            navigate('/sets');
                        }
                    });
                },
            });
        }
    };

    const authorMenuProps = {
        items: authorItems,
        onClick: handleMenuClick,
    };

    const userMenuProps = {
        items: userItems,
        onClick: handleMenuClick,
    };


    const [card, setCard] = useState({tags: []});
    const [tests, setTests] = useState([]);
    const getCardsMutation = useMutation(['getTestMutation'], (id) => axios.post(`${API_URL}/get_tests`, {
            id: id,
        }).then(res => res.data),
        {
            onSuccess: (data) => {
                let tests_data = data.map((test, i) => ({
                    key: test.id.toString(),
                    id: i + 1,
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
    }, [user])


    function createCard() {
        axios.post(`${API_URL}/create_test`, {
            id
        }).then(() => getCardsMutation.mutate(id))
    }

    let editColumns = [
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
                    <Link to={`/test/edit/${record.key}`}>Редактировать</Link>
                    <Button type="link" onClick={() => {
                        Modal.confirm({
                            title: 'Вы уверены, что хотите удалить этот вопрос?',
                            content: 'После удаления вопроса, его нельзя будет восстановить',
                            okText: 'Да',
                            okType: 'danger',
                            cancelText: 'Нет',
                            onOk() {
                                axios.post(`${API_URL}/delete_test`, {test_id: record.key})
                                    .then(res => {
                                        notification.success({
                                            message: 'Вопрос успешно удален',
                                            placement: 'bottomRight'
                                        });
                                        getCardsMutation.mutate(id);
                                    })
                                    .catch(err => {
                                        if (err.response) {
                                            notification.error({
                                                message: 'Ошибка при удалении вопроса',
                                                placement: 'bottomRight'
                                            });
                                        }
                                    })
                            },

                        });
                    }}>Удалить</Button>
                </Space>
            ),
        },
    ];


    return (
        <div className="App-main">
            <div className={styles.CardContainer}>
                <div className={styles.CardHeader}>
                    <Button type="primary" shape="circle" className={styles.BackButton} onClick={() => navigate(-1)}
                            icon={<LeftOutlined/>}/>
                    <Title>{card.title}</Title>
                    <div className={styles.optionsButtonContainer}>
                        <Dropdown menu={user.user_id === card.creator_id ? authorMenuProps : userMenuProps}
                                  className={styles.optionsMenu} placement="bottomLeft">
                            <Button>
                                <Space>
                                    <DownOutlined/>
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
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
                        </Col> : <></>}
                    </Row>
                    <div className={styles.TableContainer}>
                        <Table columns={user.user_id === card.creator_id ? editColumns : classicColumns}
                               loading={getCardsMutation.isLoading}
                               dataSource={getCardsMutation.isSuccess ? tests : []}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainCardPage;