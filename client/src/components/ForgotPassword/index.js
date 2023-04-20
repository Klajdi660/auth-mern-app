import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
	const inputs = {
		newPassword: "",
        confirmNewPassword: ""
	};
	const [data, setData] = useState(inputs);
	const [error, setError] = useState("");
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
				}, 2000);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<Form 
						className={styles.form_container} 
						onFinish={handleSubmit}
					>
						<h1>Update Password</h1>
						<Form.Item
							name="newPassword"
							rules={[{ required: true, message: 'Please input your new password!' }]}
						>
							<Input 
							    placeholder="New Password"
							    className={styles.input}
								onChange={handleChange}
								value={data.email}
								name="email"
								prefix={<UserOutlined/>}
							/>
    					</Form.Item>
						<Form.Item
							name="confirmNewPassword"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
						    <Input.Password
							    placeholder="Password"
								onChange={handleChange}
								styles={{ background: "#edf5f3" }}
							    className={styles.input}
								value={data.password}
								name="password"
								prefix={<LockOutlined/>}
							/>
						</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item shouldUpdate className={styles.buttons}>
							{() => (
                                <Button
                                    className={styles.green_btn}
                                    type="primary"
                                    htmlType="submit"
                                    icon={<UploadOutlined/>}
                                    loading={isLoginRequest[1]}
                                    onClick={() => handleLoginRequest(1)}
                                >
                                    Update Password
                                </Button>
							)}
                        </Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
