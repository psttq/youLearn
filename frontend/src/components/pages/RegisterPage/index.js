import { Button, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";

export const RegisterPage = () => {
    const onFinish = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div className={styles.LoginWrapper}>
            <div className={styles.LoginBox}>
                <span className={styles.AuthSpan}>Регистрация</span>
                <Form
                    name="basic"
                    labelCol={{ span: 16 }}
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

                    <Form.Item
                        label="Секретное слово"
                        name="secret"
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста введите секретное слово!",
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
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>
                <Link className={styles.RegisterLink} to="/login">
                    Вернуться к входу
                </Link>
            </div>
        </div>
    );
};
