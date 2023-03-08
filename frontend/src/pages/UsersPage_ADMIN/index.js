import React, {useEffect, useState} from 'react';
import styles from "./style.module.css"
import {useNavigate} from "react-router-dom";
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
        title: 'Админ?',
        key: 'is_admin',
        dataIndex: 'is_admin',
        render: (_, {id, is_admin}) => {
            const onChanged = (state) => {
                axios.post(`${API_URL}/setadmin`, {id, state}).then((res) => {
                    if(res.status === 200)
                        notification.success({
                            message: `Успех`,
                            description:
                                "Изменения применены",
                            placement: "bottomRight",
                        });
                }).catch(()=>{
                    notification.error({
                        message: `Ошибка`,
                        description:
                            "Произошла ошибка при применении изменений",
                        placement: "bottomRight",
                    });
                })
            }
            return <Checkbox key={id} defaultChecked={is_admin} onChange={(state) => {
                console.log(id, state.target.checked);
                onChanged(state.target.checked)
            }}>
            </Checkbox>;
        },
    },

];

function UsersPage(props) {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const getUsersMutation = useMutation(() => {
        return axios.post(`${API_URL}/getusers`, {}).then(res => res.data).then(data => {
                data = data.map(c => {
                    c.key = c.id;
                    return c;
                })
                console.log(data)
                setUsers(data);
            }
        )
    })

    useEffect(() => {
        getUsersMutation.mutate();
    }, []);


    return (
        <div className="App-main">
            <div className={styles.currentAttemptsContainer}>
                <Title>Пользователи:</Title>
                {getUsersMutation.isLoading ? <div className={styles.LoaderContainer}><ClipLoader size={70}/></div> :
                    <div className={styles.SetsContainer}>
                        <Table style={{width: "100%"}} columns={columns} dataSource={users}/>;
                    </div>}
            </div>
        </div>
    );
}

export default UsersPage;