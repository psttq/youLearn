import React, {useEffect, useState} from 'react';
import styles from "./style.module.css"
import {useNavigate} from "react-router-dom";
import {Typography} from "antd";
import CardPreview from "../../components/CardPreview";
import {useMutation} from "react-query";
import {API_URL} from "../../config";
import axios from "axios";
import AttemptPreview from "../../components/AttemptPreview";
import {ClipLoader} from "react-spinners";
const {Title, Text} = Typography;


function CurrentPage(props) {

    const navigate = useNavigate();
    const [cards, setCards] = useState([]);

    const getCurrentMutation = useMutation(()=>{
        return axios.post(`${API_URL}/getcurrent`, {}).then(res => res.data).then(data =>
            setCards(data)
        )
    })

    useEffect(() => {
        getCurrentMutation.mutate();

    }, []);



    return (
        <div className="App-main">
            <div className={styles.currentAttemptsContainer}>
                <Title>Текущие попытки:</Title>
                {getCurrentMutation.isLoading ? <div className={styles.LoaderContainer}><ClipLoader size={70}/></div> : <div className={styles.SetsContainer}>
                    {
                        cards.length > 0 && cards.map(card => <AttemptPreview id={card.id} title={card.title}
                                                                              imgUrl={card.img_url}
                                                                              key={card.attempt_id}
                                                                              category={card.tags[0]}
                                                                              testCount={card.test_count}
                                                                              attempt_id={card.attempt_id}
                                                                              start_time={card.start_time}
                            />
                        )
                    }
                </div>}
            </div>
        </div>
    );
}

export default CurrentPage;