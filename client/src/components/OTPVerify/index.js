import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Button, Form } from 'antd';
import OtpInput from "react18-input-otp";
import { Link, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
	const [error, setError] = useState("");
	const [form] = Form.useForm();
	const [code, setCode] = useState("");
	console.log('code :>> ', code);

	const navigate = useNavigate();

    const handleOtpChange = (code) => setCode(code);

	const getOTP = async () => {
		const url = "http://localhost:8080/api/auth/generateOTP";
		const response = await axios.get(url);
	};

	useEffect(() => {
		getOTP();
	}, []);

	const handleSubmit = async () => {
		try {
			const url = "http://localhost:8080/api/auth/sendPasswordLink";
			const response  = await axios.post(url, code);
			const { data } = response.data

			localStorage.setItem("userToken", data);
			// window.location = "/";
			navigate("");
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
						<h1>Enter Your OTP Code</h1>
						<Form.Item>
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

export default VerifyOTP;
