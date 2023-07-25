import { useState } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Checkbox, Form, Input, Layout, Typography } from 'antd';
import { LockOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { loginAPI } from "../../api/Apis";
// import LoginForm from "./LoginForm";

const { Content } = Layout;
const { Title } = Typography;

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

	const handleLoginSubmit = async () => {
		// try {
		// 	const url = "http://localhost:8080/api/auth/login";
		// 	const response = await axios.post(url, inputVal, { 
		// 		withCredentials: true 
		// 	});
			
		// 	const { status, data } = response.data;
			
		// 	if (status === 200) {
		// 		localStorage.setItem("userToken", data.token);
		// 		// window.location = "/dash";
		// 		navigate("/dash")
		// 		// setInputVal({...inputVal, email: "", password: ""});
		// 	}
		// } catch (error) {
		// 	if (
		// 		error.response &&
		// 		error.response.status >= 400 &&
		// 		error.response.status <= 500
		// 	) {
		// 		setError(error.response.data.message);

		// 		// Clear error after 5 seconds
		// 		setTimeout(() => {
		// 			setError("");
		// 		}, 3000);
		// 	}
		// }
        try {
			const res = await loginAPI(inputVal);

			if (res.status === 200) {
				const { data } = res.data;
				localStorage.setItem("userToken", data.token);
				navigate("/dash");
			} else if (
				res.response &&
				res.response.status >= 400 &&
				res.response.status <= 500
			) {
				setError(res.response.data.message);
				setTimeout(() => {
					setError("");
				}, 3000);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		// <div className={styles.login_container}>
		// 	<div className={styles.login_form_container}>
		// 		<div className={styles.left}>
		<Content
			// style={{
				// padding: '200px 30px 30px',
				// maxWidth: '440px',
				// margin: '0 auto',
				// boxShadow: '0 0 15px -10px #2d3748'
				className={styles.login_container}
			// }}
		>
					<Form 
					    form={form} 
						className={styles.form_container} 
						// onFinish={handleSubmit}
					>
						<Title>Welcome Back, Log In</Title>
						<Form.Item
							// name="usernameOrEmail"
							rules={[{ required: true, message: 'Please input your username or email!' }]}
						>
							<Input 
							    placeholder="Username or Email"
								autoComplete="username"
							    // className={styles.input}
								onChange={handleInputChange}
								value={inputVal.usernameOrEmail}
								name="usernameOrEmail"
								prefix={<UserOutlined/>}
								size="large"
							/>
    					</Form.Item>
						<Form.Item
							// name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
						    <Input.Password
							    placeholder="Password"
								onChange={handleInputChange}
							    // className={styles.input}
								value={inputVal.password}
								name="password"
								autoComplete="currnet-password"
								prefix={<LockOutlined/>}
								size="large"
							/>
						</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item className={styles.remb_forg}>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox name="remember" checked={inputVal.remember} onChange={handleInputChange}>Remember me</Checkbox> 
							</Form.Item>
							<Link to="/passwordReset" className={styles.forgot}> 
								Forgot password
							</Link>
						</Form.Item>
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="none"
								htmlType="submit"
								icon={<LoginOutlined/>}
								onClick={handleLoginSubmit}
							>
								Sign in
							</Button>
							<div className={styles.reg_link}>
								Don't have an Account? &nbsp;<Link to="/register">Sign up!</Link>
							</div>
                        </div>
						{/* <LoginForm/> */}
					</Form>
					</Content>
		// 		</div>
		// 	</div>
		// </div>
	);
};

export default Login;
