import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../common/loadingContext";
import { Space, Spin, ConfigProvider } from 'antd';

const Main = () => {
	const { loadingData, setLoadingData } = useContext(LoadingContext);
    const [data, setData] = useState(false);
    const history = useNavigate();

	// const handleLogout = () => {
	// 	localStorage.removeItem("userToken");
	// 	// window.location.reload();
	// 	history("/login");
	// };


    const handleLogout = async () => {
        let token = localStorage.getItem("userToken");
        const url = "http://localhost:8080/api/auth/logout";
		
		const res = await axios.get(url, {
			headers: {
			  "Content-Type": "application/json",
			  Authorization: token,
			  Accept: "application/json",
			},
			withCredentials: true,
		});
	  
		console.log('response :>> ', res);
    };

	const validUser = async () => {
		let token = localStorage.getItem("userToken");
		const url = "http://localhost:8080/api/auth/validUser";

		const res = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
				Accept: "application/json"
			},
			withCredentials: true
		});

		const data = res.data;

		if (data.status === 401 || !data) {
			history("*");
		} else {
			console.log("user verify");
			setLoadingData(data);
			history("/");
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setData(true);
			validUser();
		}, 2000);
	    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const email = loadingData ? loadingData?.validUser?.email : "Session expired";
	
	return (
		<>
	 	    {
				data ? 
					<div className={styles.main_container}>
						<nav className={styles.navbar}>
							<Link to="/" style={{ textDecoration: "none" }}>
								<h1>HP Cloud</h1>
							</Link>
							<button className={styles.white_btn} onClick={handleLogout}>
								Logout
							</button>
						</nav>
						<div className={styles.content}>
							Welcome <p style={{ color: "blue", fontWeight: "bold", margin:"0 10px"}}>{email}</p> in HP Cloud 
						</div>
					</div>
				: 
				<Space className={styles.loading}>   
				    <ConfigProvider
						theme={{
							token: {
								// colorPrimary: '#2a4365',
								colorPrimary: "#1a365d"
							},
						}}
					>
						<Spin tip="Loading" size="large" style={{ fontWeight: "bold" }}></Spin>
					</ConfigProvider>
			    </Space>
			}
		</>
	);
};

export default Main;
