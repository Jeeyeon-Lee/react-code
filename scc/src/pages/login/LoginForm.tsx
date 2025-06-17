import React from 'react';
import './index.css';
import { Navigate, useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import {useMenuStore} from "@stores/menuStore.ts";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setMenuCd } = useMenuStore();

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

    // 로그인 성공

    localStorage.clear();
    localStorage.setItem("accessToken", crypto.randomUUID() );
    localStorage.setItem("refreshToken", crypto.randomUUID() );
    localStorage.setItem("check", "Y");

    setMenuCd('M_MAIN');
    navigate('main');
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
      >
        <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
  );
};
export default LoginForm;