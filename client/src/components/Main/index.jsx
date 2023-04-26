import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../common/loadingContext";
import { Space, Spin, ConfigProvider } from 'antd';

const Main = () => {
	const { loading, setLoading } = useContext(LoadingContext);
    const [data, setData] = useState(false);

	// const handleLogout = () => {
	// 	localStorage.removeItem("userToken");
	// 	window.location.reload();
	// };


    const logoutUser = async () => {
        let token = localStorage.getItem("userToken");
        console.log('token :>> ', token);
        const url = "http://localhost:8080/api/auth/logout";
		
		// const res = await axios.get(url, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": token,
        //         Accept: "application/json"
        //     },
        //     credentials: "include"
        // });
	  

        // const data = await res.json();
        // console.log("data", data);

		const response = await axios.get(url, {
			headers: {
			  "Content-Type": "application/json",
			  Authorization: token,
			  Accept: "application/json",
			},
			withCredentials: true,
		});
	  
		console.log('response :>> ', response);

        // if (data.status === 201) {
        //     console.log("use logout");
            // localStorage.removeItem("userToken");
        //     // setLoginData(false)
        //     // history("/");
        // } else {
        //     console.log("error");
        // }
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
							<button className={styles.white_btn} /*onClick={handleLogout}*/ onClick={() => logoutUser()}>
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
								colorPrimary: '#2a4365',
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
