import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDecimalPlaces } from '../../../Store/slices/decimalPlaces';
import { Button, Input } from 'Components';
import { toast } from 'react-toastify';

const DecimalPlaces = () => {
    const dispatch = useDispatch();
    const currentDecimalPlace = useSelector(state => state.decimalPlaces);
    const [inputValue, setInputValue] = useState(currentDecimalPlace);

    const handleSave = () => {
        if (inputValue >= 0 && inputValue <= 5) {
            dispatch(setDecimalPlaces(inputValue));
        }
        toast.success("Decimal Value saved successfully")
    };

    return (
        <div className='px-10 pt-5' >
            <div className='w-[40%]'>
                <Input onChange={(e) => setInputValue(e?.target.value)} label={'Decimal Places'} type='number' name='decimalPlace' defaultValue={inputValue} />
                {(inputValue <= 0 || inputValue > 5) && <p className='pt-1 pb-2 text-red-600 italic' >Decimal value has to be greater than 0 and not more than 5</p>}
                <p className='pt-3 pb-5' >Current setting: {currentDecimalPlace} decimal places</p>
                <Button className={'w-full'} onClick={handleSave} >Save</Button>
            </div>

        </div>
    );
};

export default DecimalPlaces;
