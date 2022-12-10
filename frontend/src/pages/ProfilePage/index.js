import Avatar from "antd/lib/avatar/avatar";
import React, { useEffect, useState } from "react";
import { ClimbingBoxLoader } from 'react-spinners';

import styles from "./style.module.css";
import axios from 'axios';
import { API_URL } from '../../config';

export const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        axios.get(`${ API_URL }/user-info`)
            .then(response => setUserInfo(response.data))
            .catch(err => {
                //TODO: Handle incorrect
            })
    }, [])
    return (
        <div className="App-main">
            <div className={ styles.profileContainer }>
                { userInfo
                  ? (<><Avatar size={ 150 } style={ { color: '#f56a00', backgroundColor: '#fde3cf' } }
                               src={ userInfo.avatarUrl }></Avatar>
                        <span className={ styles.username }>{ userInfo.login }</span></>)
                  : (<ClimbingBoxLoader/>)
                }
            </div>
        </div>
    );
};
