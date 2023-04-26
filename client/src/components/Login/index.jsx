import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';

const Login = () => {
	const inputs = {
		email: "",
		password: "",
	};
	const [data, setData] = useState(inputs);
	const [error, setError] = useState("");
	const [form] = Form.useForm();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth";
			const res = await axios.post(url, data, { withCredentials: true });
			const { userToken } = res.data;
			localStorage.setItem("userToken", userToken);
			window.location = "/";
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
							name="email"
							rules={[{ required: true, message: 'Please input your email!' }]}
						>
							<Input 
							    placeholder="Email"
							    className={styles.input}
								onChange={handleChange}
								value={data.email}
								name="email"
								prefix={<UserOutlined/>}
							/>
    					</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
						    <Input.Password
							    placeholder="Password"
								onChange={handleChange}
							    className={styles.input}
								value={data.password}
								name="password"
								prefix={<LockOutlined/>}
							/>
						</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item className={styles.remb_forg}>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>Remember me</Checkbox> 
							</Form.Item>
							<Link to="/forgotPassword" className={styles.forgot}> 
								Forgot password
							</Link>
						</Form.Item>
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="primary"
								htmlType="submit"
								icon={<LoginOutlined/>}
							>
								Sign in
							</Button>
							<div className={styles.reg_link}>
								Don't have an Account?&nbsp;<Link to="/signup">Sign up!</Link>
							</div>
                        </div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
