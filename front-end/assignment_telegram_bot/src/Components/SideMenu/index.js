import {
  AppstoreOutlined,
  AntCloudOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
        navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Weather Details",
            icon: <AntCloudOutlined />,
            key: "/",
          },
          {
            label: "Admin Login",
            key: "/adminlogin",
            icon: <AppstoreOutlined />,
          },
          {
            label: "User Subscription",
            key: "/subscribe",
            icon: <UserOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;
