import React from 'react'
import styles from './ctacard.module.scss'
import Text from 'Components/Text'
import { useNavigate } from 'react-router-dom'

const CtaCard = ({ text, image, url }) => {

    const navigate = useNavigate();

    return (
        <div className={styles.body} onClick={() => navigate(url)} >
            <Text weight={'600'} color={'#0274bd'} size={'18px'} >{text}</Text>
            {image}

        </div>
    )
}

export default CtaCard