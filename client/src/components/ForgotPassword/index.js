import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Button, Form, Input } from 'antd';
import OtpInput from "react18-input-otp";
import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
	const inputs = { email: "" };
	const [data, setData] = useState(inputs);
	const [error, setError] = useState("");
	const [form] = Form.useForm();
	const [otp, setOtp] = useState("");


	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth/sendPasswordLink";
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
					form.resetFields();
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
						className={styles.form_container} 
						form={form}
						onFinish={handleSubmit}
					>
						<h1>Enter Your Email</h1>
						<Form.Item
							// name="email"
							// rules={[{ required: true, message: 'Please input your email!' }]}
						>
							{/* <Input
							    placeholder="Email"
							    className={styles.input}
								onChange={handleChange}
								value={data.email}
								name="email"
								prefix={<MailOutlined/>}
							/> */}
							<OtpInput
								value={otp}
								onChange={setOtp}
								numInputs={6}
								otpType="number"
								disabled={false}
								autoFocus
								// className={styles.input}
								className={styles.otp}
                			></OtpInput>
    					</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<Form.Item className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="primary"
								htmlType="submit"
							>
								Send
							</Button>
                        </Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
