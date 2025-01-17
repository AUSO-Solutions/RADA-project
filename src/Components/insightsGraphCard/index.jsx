import React from "react";
import styles from './insightsgraph.module.scss'
import Text from "Components/Text";

const InsightsGraphCard = ({children,title}) => {

    return(
        <div className={styles.body} >
            <Text weight={600} size={20}>{title}</Text> <br />
            {children}
        </div>
    )

}

export default InsightsGraphCard