import { Button, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";

export const LoginPage = () => {
    const onFinish = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div className={styles.LoginWrapper}>
            <div className={styles.LoginBox}>
                <span className={styles.AuthSpan}>Авторизация</span>
                <Form
                    name="basic"
                    labelCol={{ span: 10 }}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className={styles.LoginForm}
                >
                    <Form.Item
                        label="Логин"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста введите свой логин!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста введите свой пароль!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className={styles.SubmitButton}
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
                <Link className={styles.RegisterLink} to="/register">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
};
