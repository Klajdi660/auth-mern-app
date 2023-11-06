import { useState } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Checkbox, Form, Input } from 'antd';
import { LoginOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { registerAPI } from "../../api/Apis";
import { path } from "../../utils/paths";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../services/operations/authAPI";
import { setSignupData } from "../../slices/authSlice";

const Signup = () => {
  const inputs = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    agreedToTerms: false
  };

  const [inputVal, setInputVal] = useState(inputs);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    setInputVal({ ...inputVal, [name]: value ? value : checked });
  };
  
  const handleSubmit = async () => {
    try {
      const response = await registerAPI(inputVal)

      const { message } = response.data;
     
      setMessage(message);
      navigate(path.verifyOTP);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        form.resetFields();
      }, 3000);
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
        }, 3000);
      }
    }
  };

  const handleOnSubmit = () => {
    const signupData = {
      ...inputVal,
      // accountType,
    }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))

    // Send OTP to user for verification
    dispatch(sendOtp(inputVal.email, navigate));

    // Reset
    setInputVal({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      agreedToTerms: false,
    });
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      }
    },
  };
 
  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.right}>
          <Form
            className={styles.form_container}
            form={form}
            // onFinish={handleSubmit}
            onFinish={handleOnSubmit}
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
                value={inputVal.firstName}
                onChange={handleInputChange}
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
                value={inputVal.lastName}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input 
                name="username"
                placeholder="Username"
                autoComplete="username"
                prefix={<UserOutlined/>}
                className={styles.input}
                value={inputVal.username}
                onChange={handleInputChange}
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
                autoComplete="username"
                prefix={<MailOutlined/>}
                className={styles.input}
                value={inputVal.email}
                onChange={handleInputChange}
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
              // hasFeedback
            >
              <Input.Password 
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                prefix={<LockOutlined/>}
                className={styles.input}
                value={inputVal.password}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              // hasFeedback
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
                name="passwordConfirm"
                placeholder="Confirm Password"
                autoComplete="new-password"
                prefix={<LockOutlined/>}
                className={styles.input}
                value={inputVal.passwordConfirm}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="agreedToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox name="agreedToTerms" checked={inputVal.agreedToTerms} onChange={handleInputChange}>
                I accept the <Link to="#">Terms and Conditions!</Link>
              </Checkbox>
            </Form.Item>
            {message && (
              <div className={styles.success_msg}>{message}</div>
            )}
            {error && (
              <div className={styles.error_msg}>{error}</div>
            )}
            <div className={styles.signup_buttons}>
              <Button 
                type="none"
                htmlType="submit" 
                icon={<LoginOutlined />}
                className={styles.green_btn}
              >
                Sign Up
              </Button>
              <div className={styles.up_link}>
                Already have an account?&nbsp;&nbsp;<Link to="/">Sign in!</Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
