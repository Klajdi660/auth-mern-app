import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../common/loadingContext";
import { Space, Spin, ConfigProvider } from 'antd';

const Main = () => {
	const { loading, setLoading } = useContext(LoadingContext);
    const [data, setData] = useState(false);
    const history = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("userToken");
		window.location.reload();
	};


    // const handleLogout = async () => {
    //     let token = localStorage.getItem("userToken");
    //     const url = "http://localhost:8080/api/auth/logout";
		
	// 	const res = await axios.get(url, {
	// 		headers: {
	// 		  "Content-Type": "application/json",
	// 		  Authorization: token,
	// 		  Accept: "application/json",
	// 		},
	// 		withCredentials: true,
	// 	});
	  
	// 	console.log('response :>> ', res);
    // };

	const validUser = async () => {
		let token = localStorage.getItem("userToken");
		const url = "http://localhost:8080/api/auth/logout";

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
			setLoading(data);
			history("/");
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setData(true);
		}, 2000);
	}, []);

	return (
		<>
	 	    {
				data ? 
					<div className={styles.main_container}>
						<nav className={styles.navbar}>
							<Link to="/" style={{ textDecoration: "none" }}>
								<h1>HP Cloud</h1>
							</Link>
							<button className={styles.white_btn} /*onClick={handleLogout}*/ onClick={handleLogout}>
								Logout
							</button>
						</nav>
						<div className={styles.content}>
							Welcome HP Cloud User
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
