import { Tag } from "antd";
import Search from "antd/lib/transfer/search";
import React, { useEffect, useState } from "react";
import CardPreview from "../../components/CardPreview";
import styles from "./style.module.css"
import axios from 'axios';
import { API_URL } from '../../config';

export const CardsDashboardPage = () => {
    const [cards, setCards] = useState([])

    useEffect(() => {
        axios.get(`${ API_URL }/cards`).then(res => res.data).then(data => {
            console.log(data)
            setCards(data)
        })
    }, [])

    return (
        <div className="App-main">
            <div className={ styles.searchField }>
                <div className={ styles.searchContainer }>
                    <Search placeholder="Поиск" onSearch={ () => {
                    } }/>
                </div>
                <span className={ styles.categorySpan }>Категории:</span>
                <div className={ styles.categoryContainer }>
                    { [...Array(20).keys()].map(() => <Tag color="magenta">magenta</Tag>) }
                </div>
            </div>
            <div className={ styles.SetsContainer }>
                {
                    cards.length > 0 && cards.map(card => <CardPreview id={card.id} title={card.title} imgUrl={card.img_url} key={card.id}/>)
                }
            </div>
        </div>
    );
};