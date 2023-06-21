import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Button, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import { MailOutlined } from '@ant-design/icons';

const PasswordReset = () => {
    const [inputVal, setInputVal] = useState({ email: "" });
	const [error, setError] = useState("");
	const [form] = Form.useForm();

    const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;

        setInputVal({ ...inputVal, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth/sendPasswordLink";
			const response = await axios.post(url, inputVal, {
                withCredentials: true
            });
            const { status, data } = response.data;

            // if (status === 200) {
                // localStorage.setItem("userToken", data);
                // window.location = "/";
                navigate("/verifyOTP");
            // }
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			
				// Clear error after 5 seconds
				setTimeout(() => {
					form.resetFields();
					setError("");
				}, 3000);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.form}>
					<Form 
						className={styles.form_container} 
						form={form}
						onFinish={handleSubmit}
					>
						<h1>Enter Your Email</h1>
						<Form.Item
							name="email"
							rules={[{ required: true, message: 'Please input your email!' }]}
						>
							<Input
							    placeholder="Email"
							    className={styles.input}
								onChange={handleInputChange}
								value={inputVal.email}
								name="email"
								prefix={<MailOutlined/>}
							/>
    					</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="none"
								htmlType="submit"
							>
								Send
							</Button>
                        </div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default PasswordReset;
