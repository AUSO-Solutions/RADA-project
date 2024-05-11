import React from "react";
import CtaCard from "Components/ctacard/ctacard";
import { GrDocumentUpdate } from "react-icons/gr";
import { LuFileInput } from "react-icons/lu";


const FieldOperatorCTA = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '52px' }} >

            <CtaCard text={'Update existing data'} image={<GrDocumentUpdate color="#0274bd" size={'30px'} />} />
            <CtaCard text={'Create new data'} image={<LuFileInput color="#0274bd" size={'30px'} />} url={'/data-form'} />

        </div>
    )
}

export default FieldOperatorCTA