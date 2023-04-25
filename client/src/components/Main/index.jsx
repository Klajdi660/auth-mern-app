import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../common/loadingContext";
import { Space, Spin, ConfigProvider } from 'antd';

const Main = () => {
	const { loading, setLoading } = useContext(LoadingContext);
    const [data, setData] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
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
							<button className={styles.white_btn} onClick={handleLogout}>
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
