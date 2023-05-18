import { Link } from "react-router-dom";
import { Layout } from 'antd';
import errorImage from '../../images/404.svg';
import styles from "./styles.module.css";

const { Content } = Layout;

const Error = (props) => {
  const { validUrl, token } = props;

  return (
    <Content className={styles.error_container}>
      <img 
        className={styles.error_img}
        src={errorImage} 
        alt="error" 
      />
      {!validUrl && !token ? (
        <>
          <h2 className="mb-3">TOKEN HAS EXIRED</h2>
          <Link 
            to="/register" 
            style={{ fontSize: 18, textDecoration: "underline" }}
          > 
            Back To Register Page
          </Link>
        </> 
      ) : (
        <>
          <h2 className="mb-3">PAGE NOT FOUND</h2>
          <Link 
            to="/" 
            style={{ fontSize: 18, textDecoration: "underline" }}
          > 
            Back To Login Page
          </Link> 
        </>
      )}
    </Content>
  );
};

export default Error;
