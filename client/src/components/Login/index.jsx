import { useState, useEffect } from "react";
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
    const [, setForceUpdate] = useState({});
	const [isLoginRequest, setIsLoginRequest] = useState([]);

	const handleLoginRequest = (index) => {
		setIsLoginRequest((prevLoadings) => {
			const newLoadings = [...prevLoadings];
			newLoadings[index] = true;
			return newLoadings;
		});

		setTimeout(() => {
			setIsLoginRequest((prevLoadings) => {
				const newLoadings = [...prevLoadings];
				newLoadings[index] = false;
				return newLoadings;
			});
		}, 1000);
	};

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
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
    
	// To disable submit button at the beginning.
	useEffect(() => {
		setForceUpdate({});
	}, []);

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<Form 
					    form={form} 
						className={styles.form_container} 
						onFinish={handleSubmit}
					>
						<h1>Login to Your Account</h1>
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
						<Form.Item shouldUpdate className={styles.buttons}>
							{() => (
								<>
								    <Button
										className={styles.green_btn}
										type="primary"
										htmlType="submit"
										disabled={
											!form.isFieldsTouched(true) ||
											!!form.getFieldsError().filter(({ errors }) => errors.length).length
										}
										icon={<LoginOutlined/>}
										loading={isLoginRequest[1]}
										onClick={() => handleLoginRequest(1)}
									>
										Sign in
									</Button>
									<div className={styles.reg_link}>
										Or &nbsp;&nbsp;<Link to="/signup">register now!</Link>
									</div>
								</>
							)}
                        </Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
