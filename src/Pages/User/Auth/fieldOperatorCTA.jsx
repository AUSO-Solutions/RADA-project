import React from "react";
import CtaCard from "Components/ctacard/ctacard";
import { GrDocumentUpdate } from "react-icons/gr";
import { LuFileInput } from "react-icons/lu";
import Text from "Components/Text";
import { Button } from "Components";


const FieldOperatorCTA = () => {

    return (

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }} >
            <Text size={'20px'} weight={'600'} color={'#0274bd'} > Choose an action to perform </Text>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '52px' }} >
                <Button width={'200px'}> Update Existing Data </Button>
                <Button width={'200px'}> Create New Data </Button>


            </div>
        </div>

    )
}

export default FieldOperatorCTA