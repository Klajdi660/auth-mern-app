import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../common/loadingContext";
import { Button, Space, Spin, ConfigProvider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const Main = () => {
	const { loadingData, setLoadingData } = useContext(LoadingContext);
    const [data, setData] = useState(false);
    const history = useNavigate();
	
    const handleLogout = async () => {
        let token = localStorage.getItem("userToken");
	
        const url = "http://localhost:8080/api/auth/logout";
		
		const res = await axios.get(url, {
			headers: {
			  "Content-Type": "application/json",
			    // Authorization: token,
			  Authorization: `Bearer ${token}`,
			  Accept: "application/json",
			},
			withCredentials: true,
		});
		
        const { status } = res.data;

		if (status === 201) {
            localStorage.removeItem("userToken");
            setLoadingData(false);
            history("/");
        } else {
            console.log("error");
        }
    };

	const validUser = async () => {
		let token = localStorage.getItem("userToken");
		const url = "http://localhost:8080/api/auth/validUser";

		const res = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				// Authorization: token,
				Authorization: `Bearer ${token}`,
				Accept: "application/json"
			},
			withCredentials: true
		});

		const data = res.data;

		if (data.status === 401 || !data) {
			history("*");
		} else {
			setLoadingData(data);
			history("/dash");
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setData(true);
			validUser();
		}, 2000);
	    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const username = loadingData?.validUser?.username;

	return (
		<>
	 	    {data ? (
				<div className={styles.main_container}>
					<div className={styles.navbar}>
						<Link to="/dash" style={{ textDecoration: "none" }} className={styles.logo}>
							HP Cloud
						</Link>
						<Button 
							type="none"
							htmlType="submit"
							className={styles.white_btn} 
							onClick={handleLogout}
							icon={<LogoutOutlined />}
						>
							Logout
						</Button>
					</div>
					<div className={styles.content}>
						Welcome <p className={styles.content_msg}>{username}</p> in HP Cloud 
					</div>
				</div>
			) : (  
				<Space className={styles.loading}>   
				    <ConfigProvider
						theme={{
							token: {
								colorPrimary: "#1a365d"
							},
						}}
					>
						<Spin 
							tip="Loading" 
							size="large" 
							style={{ fontWeight: "bold" }}
						/>
					</ConfigProvider>
			    </Space>
			)}
		</>
	);
};

export default Main;
