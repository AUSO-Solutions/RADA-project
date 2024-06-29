import React, { useState } from "react";
import styles from "./layout.module.scss";
import Sidenav from "Components/sidenav";
import Navbar from "Components/navbar";
import { useMediaQuery } from "@mui/material";
import { BsMenuButton } from "react-icons/bs";
import ClickAway from "../clickaway";
// import { Button, Text } from '@/components';
// import { Button } from "Components";

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
      <div className={styles.content}>
        <Navbar />
        <BsMenuButton
          size={20}
          className={styles.menubutton}
          onClick={() => setShowSide(!showSideBar)}
        />
     
        <div className={styles.layoutChildren}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
