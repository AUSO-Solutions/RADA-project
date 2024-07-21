import React from 'react'
import styles from './broadcastcard.module.scss'
import { Button } from 'Components'
import oilmetering from 'Assets/images/oilmetering.svg'
import Text from 'Components/Text'
import { colors } from 'Assets'

const BroadcastCard = () => {

    return (
        <div className={styles.body} >
            <div className={styles.content} >
                <div className={styles.metering} >
                    <img src={oilmetering} alt='' />
                    <Text weight={'600'} color={colors.rada_blue} >Daily Oil Metering</Text>
                </div>

                <Text>Created: 08/16/2024</Text>

            </div>
            <div>
                <Button width={'100px'} >View</Button>
            </div>
        </div>
    )

}

export default BroadcastCard