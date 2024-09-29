import React from "react";
import styles from './insightsgraph.module.scss'
import Text from "Components/Text";

const InsightsGraphCard = ({children}) => {

    return(
        <div className={styles.body} >
            {children}
        </div>
    )

}

export default InsightsGraphCard