import React, {useEffect} from 'react';
import {Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const cookie = new Cookies();
        cookie.remove('token');
        navigate("/")
    }, [])
    return (<></>

    );
};

export default Logout;