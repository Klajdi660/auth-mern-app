import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';

const Login = () => {
	const [inputVal, setInputVal] = useState({
		usernameOrEmail: "",
        password: "",
		remember: false
	});
	const [error, setError] = useState("");
	const [form] = Form.useForm();
	const navigate = useNavigate();
    
	const handleInputChange = (e) => {
		const { name, value, checked } = e.target;
	
		setInputVal({ ...inputVal, [name]: value ? value : checked });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth/login";
			const response = await axios.post(url, inputVal, { 
				withCredentials: true 
			});
			
			const { status, data } = response.data;
			
			if (status === 201) {
				localStorage.setItem("userToken", data.token);
				// window.location = "/dash";
				navigate("/dash")
				// setInputVal({...inputVal, email: "", password: ""});
			}
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);

				// Clear error after 5 seconds
				setTimeout(() => {
					setError("");
				}, 3000);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<Form 
					    form={form} 
						className={styles.form_container} 
						onFinish={handleSubmit}
					>
						<h1>Welcome Back, Log In</h1>
						<Form.Item
							name="usernameOrEmail"
							rules={[{ required: true, message: 'Please input your username or email!' }]}
						>
							<Input 
							    placeholder="Username or Email"
								autoComplete="username"
							    className={styles.input}
								onChange={handleInputChange}
								value={inputVal.usernameOrEmail}
								name="usernameOrEmail"
								prefix={<UserOutlined/>}
							/>
    					</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
						    <Input.Password
							    placeholder="Password"
								onChange={handleInputChange}
							    className={styles.input}
								value={inputVal.password}
								name="password"
								autoComplete="currnet-password"
								prefix={<LockOutlined/>}
							/>
						</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item className={styles.remb_forg}>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox name="remember" checked={inputVal.remember} onChange={handleInputChange}>Remember me</Checkbox> 
							</Form.Item>
							<Link to="/forgotPassword" className={styles.forgot}> 
								Forgot password
							</Link>
						</Form.Item>
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="none"
								htmlType="submit"
								icon={<LoginOutlined/>}
							>
								Sign in
							</Button>
							<div className={styles.reg_link}>
								Don't have an Account? &nbsp;<Link to="/register">Sign up!</Link>
							</div>
                        </div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
