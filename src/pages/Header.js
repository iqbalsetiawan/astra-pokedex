import React from "react";
import { Row, Col } from "antd";
import { GithubOutlined } from "@ant-design/icons";

import logo from "../assets/pokedex.png";

const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Row justify="space-between" align="middle">
          <Col xs={12} sm={12} md={6} lg={6}>
            <div className="logo" onClick={scrollToTop}>
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <div className="github-link">
              <a
                href="https://github.com/iqbalsetiawan/astra-pokedex"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined style={{ fontSize: "30px" }} />
              </a>
            </div>
          </Col>
        </Row>
      </div>
    </header>
  );
};

export default Header;
