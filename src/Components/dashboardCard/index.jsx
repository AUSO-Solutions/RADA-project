import Text from "Components/Text";
import React from "react";
import styles from './dashboardcard.module.scss'
import { HiOutlineArrowTrendingDown } from "react-icons/hi2";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

const DashboardCard = ({ title, img, subText, num, lastWeek, targetVal, variance }) => {

    return (

        <div className={styles.body} >
            <div className="flex flex-col gap-2 pt-2 px-2" >
                <div className={styles.top} >
                    <img src={img} alt="img" />
                    <Text weight={'500'} >{title}</Text>
                    <Text>{subText}</Text>
                </div>
                <div className={styles.bottom}>
                    <Text weight={'600'} size={'18px'} >{num}</Text>
                    {/* <Text>{lastWeek}</Text> */}
                   <div className="flex items-center">
                   <Text color={variance?.color}>{variance?.status === 'negative' ? <HiOutlineArrowTrendingDown /> : <HiOutlineArrowTrendingUp />}</Text>
                    <Text size={14} className={'float-right !break-keep'} color={variance?.color} >
                        {variance?.percent}%</Text>
                   </div>
                </div>
            </div>
            {
                <div className={styles.target} >
                    <Text weight={'600'} color={'white'} >{targetVal}</Text>
                </div>
            }
        </div>
    )

}

export default DashboardCard