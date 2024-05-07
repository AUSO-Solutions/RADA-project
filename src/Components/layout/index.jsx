import React, { useState } from "react";
import styles from "./layout.module.scss";
import Sidenav from "Components/sidenav";
import Header from "Components/header";
import { Typography, useMediaQuery } from "@mui/material";
import { BsMenuButton } from "react-icons/bs";
import ClickAway from "../clickaway";
// import { Button, Text } from '@/components';
import { Button } from "Components";

function Layout({ name = "Home", children, btn, goBack = () => null }) {
  const isMobile = useMediaQuery("(min-width:900px)");
  const [showSideBar, setShowSide] = useState(false);
  return (
    <div className={styles.body}>
       {(isMobile || showSideBar) && (
        <ClickAway
          showshadow={!isMobile}
          onClickAway={() => setShowSide(!showSideBar)}
        >
          {" "}
          <Sidenav />{" "}
        </ClickAway>
      )}
      <div style={{ width: "100%" }}>
        <Header />
        <BsMenuButton
          size={20}
          className={styles.menubutton}
          onClick={() => setShowSide(!showSideBar)}
        />
        <div className={styles.action}>
          <Typography
            style={{ fontSize: "20px", fontWeight: "bold", color: "#0274bd" }}
            className="flex items-center gap-[10px]"
          >
            {" "}
            {name}{" "}
          </Typography>
          {btn && (
            <Button
              onClick={() => btn?.onClick()}
              //  bgcolor={'blue'} color={'red'}
            >
              {" "}
              {btn?.text}
            </Button>
          )}
        </div>
        <div className={styles.layoutChildren}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
