import {Input, notification, Select, Tag, Typography} from "antd";
import React, {useEffect, useState} from "react";
import CardPreview from "../../components/CardPreview";
import styles from "./style.module.css"
import axios from 'axios';
import {API_URL} from '../../config';
import {stringToColour} from "../../Utils/utils";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {resetNotification, selectNotifications} from "../../redux/slices/notificationSlice";
import {useMutation} from "react-query";
import {ClipLoader} from "react-spinners";

const {Title, Text} = Typography;

const {Search} = Input;

const exampleCategories = ["Математика", "Комплексные числа", "Введение в комплексный анализ", "ТФКП", "Вождение",
    "Математический анализ", "Ряды", "Теория поля", "Топология", "Майнкрафт", "Коты", "Гарри Поттер",
    "Дифференциальная геометрия", "Функциональный анализ", "Тензорный анализ", "Теория вероятности", "Теория хаоса",
    "Теория Категорий"]


export const CardsDashboardPage = () => {
    const [cards, setCards] = useState([])
    const [tags, setTags] = useState([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();

    let [selectedTagsSet, setSelectedTagSet] = useState(new Set());
    const notifications = useSelector(selectNotifications);


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
    const [api, _] = notification.useNotification();
    const dispatch = useDispatch();

    const getCardsMutation = useMutation(() => {
        return axios.post(`${API_URL}/cards`, {
            name: searchParams.get('name'),
            categories: Array.from(selectedTagsSet)
        }).then(res => res.data).then(data => {
            console.log(data);
            setCards(data)
        });
    });

    useEffect(() => {

        if (notifications.notify && notifications.target === "dashboard") {
            if (notifications.status === "success") {
                console.log("notify")
                notification.success({
                    message: `Успех`,
                    description:
                    notifications.message,
                    placement: "bottomRight",
                });
            } else
                notification.error({
                    message: `Ошибка`,
                    description:
                    notifications.message,
                    placement: "bottomRight",
                });
            dispatch(resetNotification());
        }

        getCardsMutation.mutate();


        console.log(searchParams.get('name'))

        axios.get(`${API_URL}/getalltags`).then(res => res.data).then(data => {
            setTags(data.map(e => {
                return {
                    value: e.id,
                    label: e.name
                }
            }))
        })
    }, [searchParams, selectedTagsSet, notifications])

    return (
        <div className="App-main">
            <Title>Все карточки</Title>
            <div className={styles.searchField}>
                <div className={styles.searchContainer}>
                    <Search placeholder="Поиск" onSearch={(text) => {
                        if (text.length > 0)
                            navigate(`/sets?name=${text}`);
                        else
                            navigate(`/sets`);
                    }}/>
                </div>
                <span className={styles.categorySpan}>Категории:</span>
                <Select
                    mode="tags"
                    showArrow
                    tagRender={tagRender}
                    tokenSeparators={[',']}
                    style={{width: '100%', marginTop: 10}}
                    options={tags}
                    // @ts-ignore
                    onSelect={(value, option) => {
                        let selectedTags = new Set(selectedTagsSet);
                        selectedTags.add(value);
                        setSelectedTagSet(selectedTags)
                    }}
                    // @ts-ignore
                    onDeselect={(value, option) => {
                        let selectedTags = new Set(selectedTagsSet);
                        selectedTags.delete(value);
                        setSelectedTagSet(selectedTags);
                    }}
                />
            </div>
            {getCardsMutation.isLoading ? <div className={styles.LoaderContainer}><ClipLoader size={70}/></div> :
                <div className={styles.SetsContainer}>
                    {
                        cards.length > 0 && cards.map(card => <CardPreview id={card.id} title={card.title}
                                                                           imgUrl={card.img_url} key={card.id}
                                                                           category={card.tags[0]}
                                                                           testCount={card.test_count}
                                                                           isadded={card.isadded}
                            />
                        )
                    }
                </div>}
        </div>
    );
};
