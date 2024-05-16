import React from "react";
import Text from "Components/Text";
import { Button } from "Components";
import { useNavigate } from "react-router-dom";


const FieldOperatorCTA = () => {
const navigate =  useNavigate()
    return (

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }} >
            {/* <Text size={'20px'} weight={'600'} color={'#0274bd'} > Choose an action to perform </Text> */}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '52px' }} >
                {/* <Button width={'200px'}> Update Existing Data </Button> */}
                <Button width={'200px'} onClick={()=>navigate('/data-form')}>  Create New Data </Button>


            </div>
        </div>

    )
}

export default FieldOperatorCTA