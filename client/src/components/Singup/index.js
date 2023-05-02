import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import {
  Button,
  Checkbox,
  Form,
  Input,
} from 'antd';
import { LoginOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Signup = () => {
  const inputs = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };

  const [data, setData] = useState(inputs);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form] = Form.useForm();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  
  const handleSubmit = async () => {
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
      // setData(inputs); // reset input fields to initial state
      // Clear message after 3 seconds
      setTimeout(() => {
        setMsg("");
        form.resetFields();
      }, 3000);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);

        // Clear error after 3 seconds
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      }
    },
  };
 
  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.right}>
          <Form
            className={styles.form_container}
            form={form}
            onFinish={handleSubmit}
          >
            <h1>Create Account</h1>
            <Form.Item
              name="firstName"
              rules={[{
                required: true,
                message: 'Please input your First name',
              }]}
            >
              <Input
                name="firstName"
                placeholder="First Name"
                prefix={<UserOutlined/>}
                className={styles.input}
                value={data.firstName}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{
                required: true,
                message: 'Please input your Last name',
              }]}
            >
              <Input
                name="lastName"
                placeholder="Last Name"
                prefix={<UserOutlined/>}
                className={styles.input}
                value={data.lastName}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input 
                name="email"
                placeholder="Email"
                prefix={<MailOutlined/>}
                className={styles.input}
                value={data.email}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              // hasFeedback
            >
              <Input.Password 
                name="password"
                placeholder="Password"
                prefix={<LockOutlined/>}
                className={styles.input}
                value={data.password}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              // hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                name="passwordConfirm"
                placeholder="Confirm Password"
                prefix={<LockOutlined/>}
                className={styles.input}
                value={data.passwordConfirm}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I accept the <Link to="#">Terms and Conditions!</Link>
              </Checkbox>
            </Form.Item>
            {msg && (
              <div className={styles.success_msg}>{msg}</div>
            )}
            {error && (
              <div className={styles.error_msg}>{error}</div>
            )}
            <div className={styles.signup_buttons}>
              <Button 
                // type="primary"
                type="none"
                htmlType="submit" 
                icon={<LoginOutlined />}
                className={styles.green_btn}
              >
                Sign Up
              </Button>
              <div className={styles.up_link}>
                Already have an account?&nbsp;&nbsp;<Link to="/">Sign in!</Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// // Forgot Password route
// router.post("/forgotPassword", async (req, res) => {
// 	const { email } = req.body;

// 	try {
// 		// Check if user with the given email exists in the database
// 		connection.query('SELECT * FROM register WHERE email = ?', [email], async (err, results) => {
// 			const user = results[0];

// 			if (!user) {
// 				return res.status(404).send({ error: true, message: "Email not found" });
// 			}

// 			// Generate password reset token
// 			// const resetToken = generateResetToken();

// 			// Update user's reset token and its expiration time in the database
// 			connection.query('UPDATE register SET id = ? WHERE email = ?', [email], async (err, results) => {
// 				if (err) {
// 					return res.status(500).send({ error: true, message: "Failed to update reset token" });
// 				}

// 				// Send password reset email
// 				const resetUrl = `http://localhost:3000/users/resetPassword/${resetToken}`;
// 				await sendPasswordResetEmail({ email: user.email, resetUrl });

// 				return res.status(200).send({ error: false, message: "Password reset token has been sent to your email." });
// 			});
// 		});
// 	} catch (error) {
// 		res.status(500).send({ error: true, message: "Internal Server Error" });
// 	}
// });

// // Reset Password route
// router.post("/resetPassword/:token", async (req, res) => {
// 	const { token } = req.params;
// 	const { newPassword } = req.body;

// 	try {
// 		// Check if user with the given reset token exists in the database
// 		connection.query('SELECT * FROM register WHERE reset_token = ? AND reset_token_expires > ?', [token, Date.now()], async (err, results) => {
// 			const user = results[0];

// 			if (!user) {
// 				return res.status(404).send({ error: true, message: "Invalid or expired reset token" });
// 			}

// 			// Set new password
// 			const salt = await bcrypt.genSalt(10);
// 			const hashedPassword = await bcrypt.hash(newPassword, salt);
// 			connection.query('UPDATE register SET password = ?, salt = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?', [hashedPassword, salt, user.email], async (err, results) => {
// 				if (err) {
// 					return res.status(500).send({ error: true, message: "Failed to update password" });
// 				}

// 				return res.status(200).send({ error: false, message: "Password has been successfully reset." });
// 			});
// 		});
// 	} catch (error) {
// 		res.status(500).send({ error: true, message: "Internal Server Error" });
// 	}
// });

// // Helper function to generate password reset token
// const generateResetToken = () => {
// 	// Implement your token generation logic here
// };

// // Helper function to send password reset email
// const sendPasswordResetEmail = async ({ email, resetUrl }) => {
// 	// Implement your email sending logic here
// };

