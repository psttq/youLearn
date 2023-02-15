import { Button, Form, Input } from "antd";
import React, { useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import axios from "axios";
import { API_URL } from '../../config';
import { setAuthCookies } from '../../auth/tools';

var md5 = require('md5');

export const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.post(`${ API_URL }/login`, {
            login:    values.username,
            password: md5(values.password),
        })
            .then(function (response) {
                const { token, expires } = response.data;

                if (!token || !expires) {
                    // TODO: Error

                    return;
                }
                
                if(!setAuthCookies(token, expires)){
                    // TODO: Expiration date parsed incorrectly
                }

                navigate('/profile');


            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div className={ styles.LoginWrapper }>
            <div className={ styles.LoginBox }>
                <span className={ styles.AuthSpan }>Авторизация</span>
                <Form
                    name="basic"
                    labelCol={ { span: 10 } }
                    layout="vertical"
                    initialValues={ { remember: true } }
                    onFinish={ onFinish }
                    onFinishFailed={ onFinishFailed }
                    autoComplete="off"
                    className={ styles.LoginForm }
                >
                    <Form.Item
                        label="Логин"
                        name="username"
                        rules={ [
                            {
                                required: true,
                                message:  "Пожалуйста введите свой логин!",
                            },
                        ] }
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={ [
                            {
                                required: true,
                                message:  "Пожалуйста введите свой пароль!",
                            },
                        ] }
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className={ styles.SubmitButton }
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
                <Link className={ styles.RegisterLink } to="/register">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
};
