import {Tag} from "antd";
import Search from "antd/lib/transfer/search";
import React, {useEffect, useState} from "react";
import CardPreview from "../../components/CardPreview";
import styles from "./style.module.css"
import axios from 'axios';
import {API_URL} from '../../config';
import {stringToColour} from "../../Utils/utils";

const exampleCategories = ["Математика", "Комплексные числа", "Введение в комплексный анализ", "ТФКП", "Вождение",
    "Математический анализ", "Ряды", "Теория поля", "Топология", "Майнкрафт", "Коты", "Гарри Поттер",
    "Дифференциальная геометрия", "Функциональный анализ", "Тензорный анализ", "Теория вероятности", "Теория хаоса",
    "Теория Категорий"]


export const CardsDashboardPage = () => {
    const [cards, setCards] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/cards`).then(res => res.data).then(data => {
            setCards(data)
            console.log(data)
        })

        axios.get(`${API_URL}/getalltags`).then(res => res.data).then(data => {
            setTags(data)
        })
    }, [])

    return (
        <div className="App-main">
            <div className={styles.searchField}>
                <div className={styles.searchContainer}>
                    <Search placeholder="Поиск" onSearch={() => {
                    }}/>
                </div>
                <span className={styles.categorySpan}>Категории:</span>
                <div className={styles.categoryContainer}>
                    {tags.map((category) => <Tag className={styles.Category} color={stringToColour(category)}>{category}</Tag>)}
                </div>
            </div>
            <div className={styles.SetsContainer}>
                {
                    cards.length > 0 && cards.map(card => <CardPreview id={card.id} title={card.title}
                                                                       imgUrl={card.img_url} key={card.id} category={card.tags[0]} testCount={card.test_count}/>)
                }
            </div>
        </div>
    );
};
