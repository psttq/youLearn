import { Alert, Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import axios from "axios";

import { CheckOutlined } from "@ant-design/icons";
import { API_URL } from '../../config';

var md5 = require('md5');


export const RegisterPage = () => {

  const [isLoginTaken, setLoginTaken] = useState(false);
  const [isRegistered, setRegistered] = useState(false);
  const onFinish = async (values) => {
    console.log("Success:", values);

    axios.post(`${API_URL}/registration`, {
      login: values.username,
      password: md5(values.password)
    })
      .then(function(response) {
        if (response.status === 200)
          setRegistered(true);
      })
      .catch(function(error) {
        if (error.response.status === 409) {
          setLoginTaken(true);
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={styles.LoginWrapper}>
      <div className={styles.LoginBox}>
        {isRegistered === false ? <>
          <span className={styles.AuthSpan}>Регистрация</span>
          {isLoginTaken && <Alert type="error" message="Такой логин уже занят!" closable className={styles.errorAlert} onClose={() => setLoginTaken(false)} />}
          <Form
            name="basic"
            labelCol={{ span: 16 }}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
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
              label="Повторите пароль"
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, подтвердите пароль!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
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
          </Link> </> :
          <>
            <h1>Успешная регистрация!</h1>
            <CheckOutlined style={{margin: 30, fontSize: 60, color: "rgb(72, 213, 72)"}} size={120} />
            <Link className={styles.RegisterLink} to="/login" >
              Вернуться ко входу
            </Link>
          </>
        }
      </div>
    </div>
  );
};
