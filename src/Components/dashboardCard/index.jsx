import Text from "Components/Text";
import React from "react";
import styles from './dashboardcard.module.scss'


const DashboardCard = ({ title, img, subText, num, lastWeek, targetVal }) => {

    return (

        <div className={styles.body} >
            <div className="flex flex-col gap-2 pt-2 px-2" >
                <div className={styles.top} >
                    <img src={img} alt="img" />
                    <Text weight={'500'} >{title}</Text>
                    <Text>{subText}</Text>
                </div>
                <div className={styles.bottom}>
                    <Text weight={'600'} size={'22px'} >{num}</Text>
                    <Text>{lastWeek}</Text>
                </div>
            </div>
            {
                targetVal && <div className={styles.target} >
                    <Text weight={'600'} color={'white'} >{targetVal}</Text>
                </div>
            }
        </div>
    )

}

export default DashboardCard