import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Button, Form, Input } from 'antd';
import OtpInput from "react18-input-otp";
import { Link } from "react-router-dom";
// import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
	const inputs = { email: "" };
	const [data, setData] = useState(inputs);
	const [error, setError] = useState("");
	const [form] = Form.useForm();
	const [code, setCode] = useState("");

    const handleOtpChange = (code) => setCode(code);

	// const handleChange = ({ currentTarget: input }) => {
	// 	setData({ ...data, [input.name]: input.value });
	// };

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
				<div className={styles.form}>
					<Form 
						className={styles.form_container} 
						form={form}
						onFinish={handleSubmit}
					>
						{/* <h1>Enter Your Email</h1> */}
						<h1>Recovery Password</h1>
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
								value={code}
								onChange={handleOtpChange}
								numInputs={6}
								separator={<span style={{ width: "8px" }}></span>}
								isInputNum={true}
								shouldAutoFocus={true}
						        inputStyle={{
									border: "1px solid #CFD3DB",
									borderRadius: "8px",
									width: "54px",
									height: "54px",
									fontSize: "12px",
									color: "#000",
									fontWeight: "400",
									caretColor: "blue"
								}}
								focusStyle={{
								    border: "1px solid #1677ff",
									outline: "none"
								}}
                			/>
    					</Form.Item>
						{error && <div className={styles.error_msg}>{error}</div>}
						<div className={styles.buttons}>
							<Button
								className={styles.green_btn}
								type="none"
								htmlType="submit"
							>
								Recover
							</Button>
							<div className={styles.reg_link}>
								Can't get OTP? &nbsp;<Link to="#">Resend!</Link>
							</div>
                        </div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
