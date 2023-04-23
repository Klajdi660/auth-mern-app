import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
// import { Formik, Form, Field } from "formik";
import validationSchema from "./validation.jsx";

import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { LoginOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Signup = () => {
  const inputs = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };

  const [data, setData] = useState(inputs);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form] = Form.useForm();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
      setData(inputs); // reset input fields to initial state
    
      // Clear message after 3 seconds
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);

        // Clear error after 3 seconds
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    }
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        // span: 16,
        // offset: 8,
      },
    },
  };
 
  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        {/* <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sing in
            </button>
          </Link>
        </div> */}
        <div className={styles.right}>
          {/* <Formik
            initialValues={data}
            validationSchema={validationSchema}
            // onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <Field
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleChange}
                  value={data.firstName}
                  className={styles.input}
                />
                <Field
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  value={data.lastName}
                  className={styles.input}
                />
                <Field
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  className={styles.input}
                />
                <Field
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                  className={styles.input}
                />
                <Field
                  type="password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  onChange={handleChange}
                  value={data.passwordConfirm}
                  className={styles.input}
                />
                <button type="submit" className={styles.green_btn}>
                  Sign Up
                </button>
                {msg && (
                  <div className={styles.success_msg}>{msg}</div>
                )}
                {error && (
                  <div className={styles.error_msg}>{error}</div>
                )}
              </Form>
            )}
          </Formik> */}
          <Form
            form={form}
            name="register"
            onFinish={""}
            // scrollToFirstError
            className={styles.form_container}
          >
            <h1>Create Account</h1>
            <Form.Item
              name="firstName"
              rules={[{
                required: true,
                message: 'Please input your First name',
              }]}
            >
              <Input
                name="firstName"
                placeholder="First Name"
                prefix={<UserOutlined/>}
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{
                required: true,
                message: 'Please input your Last name',
              }]}
            >
              <Input
                name="lastName"
                placeholder="Last Name"
                prefix={<UserOutlined/>}
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input 
                name="email"
                placeholder="Email"
                prefix={<MailOutlined/>}
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password 
                name="password"
                placeholder="Password"
                prefix={<LockOutlined/>}
                className={styles.input}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                name="confirmPassword"
                placeholder="Confirm Password"
                prefix={<LockOutlined/>}
                className={styles.input}
              />
            </Form.Item>
          </Form>
          <Form.Item
            name="agreement"
            // valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>
          <Button 
            type="primary"
            htmlType="submit" 
            icon={<LoginOutlined />}
            className={styles.green_btn}
          >
            Sign Up
          </Button>
          {msg && (
            <div className={styles.success_msg}>{msg}</div>
          )}
          {error && (
            <div className={styles.error_msg}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;