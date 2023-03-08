import React, {useEffect, useState} from 'react';
import styles from "./style.module.css"
import {useNavigate, useParams} from "react-router-dom";
import {Checkbox, Table, Typography} from "antd";
import CardPreview from "../../components/CardPreview";
import {useMutation} from "react-query";
import {API_URL} from "../../config";
import axios from "axios";
import AttemptPreview from "../../components/AttemptPreview";
import {ClipLoader} from "react-spinners";
import {BugOutlined} from "@ant-design/icons";
import ResultPreview from "../../components/ResultPreview";
import {notification} from "antd/lib";

const {Title, Text} = Typography;

const columns = [
    {
        title: 'Логин',
        dataIndex: 'login',
        key: 'login',
    },
    {
        title: 'Результат',
        dataIndex: 'result',
        key: 'result',
    },

];

function AllResultsPage(props) {

    const navigate = useNavigate();
    const {id: card_id} = useParams();
    const [results, setResults] = useState([]);

    const getResultsMutation = useMutation(() => {
        return axios.post(`${API_URL}/getresults`, {card_id}).then(res => res.data).then(data => {
                data = data.map((v, i) => {
                    v.key = i;
                    v.result = v.result.toString() + "%";
                    return v;
                });
                console.log(data)
                setResults(data);
            }
        )
    })

    useEffect(() => {
        getResultsMutation.mutate()
    }, []);


    return (
        <div className="App-main">
            <div className={styles.currentAttemptsContainer}>
                <Title>Результаты:</Title>
                <Table style={{width: "100%"}} columns={columns} dataSource={results} loading={getResultsMutation.isLoading}/>;
            </div>
        </div>
    );
}

export default AllResultsPage;