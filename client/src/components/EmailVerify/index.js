import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import success from "../../images/success.png";
import styles from "./styles.module.css";
import Error from "../Error";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();
  
	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:8080/api/users/${param.id}/verify?token=${param.token}`;
				await axios.get(url);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<>
			{validUrl && param.token ? (
				<div className={styles.verify_container}>
					<img src={success} alt="success_img"/>
					<h1>Email verified successfully</h1>
					<Link to="/" className={styles.verify_link}>
						<Button 
						    type="none"
							htmlType="submit"
							icon={<LoginOutlined />}
							className={styles.verify_btn}
						>
							Login
						</Button>
					</Link>
				</div>
			) : (
				<Error validUrl={validUrl} token={param.token}/>
			)}
		</>
	);
};

export default EmailVerify;
