import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { LoadingContext } from "../../common/loadingContext";

const Login = () => {
	const [inputVal, setInputVal] = useState({
		email: "",
        password: "",
	});
	const [error, setError] = useState("");
	const [form] = Form.useForm();
	const { loadingData, setLoadingData } = useContext(LoadingContext);
	const history = useNavigate();

	const [remember, setRemember] = useState(false);

	const handleRememberChange = (e) => {
	    setRemember(e.target.checked);
	};

	const handleChange = ({ currentTarget: input }) => {
		setInputVal({ ...inputVal, [input.name]: input.value });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth";
			const res = await axios.post(url, { ...inputVal, remember }, { 
				withCredentials: true 
			});
			
			const {status, result } = res.data;

			if (status === 201) {
				localStorage.setItem("userToken", result.token);
				// window.location = "/dash";
				history("/dash")
				// setInputVal({...inputVal, email: "", password: ""})
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
							name="email"
							rules={[{ required: true, message: 'Please input your email!' }]}
						>
							<Input 
							    placeholder="Email"
								autoComplete="username"
							    className={styles.input}
								onChange={handleChange}
								value={inputVal.email}
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
								value={inputVal.password}
								name="password"
								autoComplete="currnet-password"
								prefix={<LockOutlined/>}
							/>
						</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item className={styles.remb_forg}>
							{/* <Form.Item name="remember" valuePropName="checked" noStyle> */}
								<Checkbox checked={remember} onChange={handleRememberChange}>Remember me</Checkbox> 
							{/* </Form.Item> */}
							<Link to="/forgotPassword" className={styles.forgot}> 
								Forgot password
							</Link>
						</Form.Item>
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								// type="primary"
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
