import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";

const LoginForm = () => {
    return (
        <>
            <Form.Item
                name="usernameOrEmail"
                rules={[{ required: true, message: 'Please input your username or email!' }]}
            >
                <Input
                    prefix={<UserOutlined/>}
                    placeholder="Username or Email"
                    autoComplete="usernameOrEmail"
                    size="large"  
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password
                    prefix={LockOutlined}
                    placeholder="Password"
                    autoComplete="password"
                    size="large"
                />
            </Form.Item>
        </>
    );
};

export default LoginForm();
