import React from "react";
import styles from "./clickaway.module.scss";

function ClickAway({ children, showshadow = false, onClickAway = () => null }) {
  return (
    <>
      {children}
      {showshadow && (
        <div className={styles.clickaway} onClick={onClickAway}></div>
      )}
    </>
  );
}

export default ClickAway;
