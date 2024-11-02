import { Divider } from '@mui/material'
import { Button, Input } from 'Components'
import Text from 'Components/Text'
import { useFetch } from 'hooks/useFetch'
import { useMe } from 'hooks/useMe'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { firebaseFunctions } from 'Services'

const ToleranceSettiings = ({ onClickOut = () => null }) => {
    const [searchParams] = useSearchParams()
    const values = [
        { title: "Gross", name: 'gross', type: "number", unit: 'blpd' },
        { title: "Oil Rate", name: 'oilRate', type: "number", unit: "bopd" },
        { title: "Water Rate", name: 'waterRate', type: "number", unit: "bwpd" },
        { title: "Gas Rate", name: 'gasRate', type: "number", unit: "MMscf/day" },
        { title: "BSW", name: 'bsw', type: "number", unit: "%" },
    ]
    const [toleranceValues, setTolenranceValue] = useState({})
    const { user } = useMe()
    const { data: ipsc } = useFetch({ firebaseFunction: 'getSetup', payload: { id: searchParams.get('id'), setupType: 'IPSC' } })
    useEffect(() => {
        setTolenranceValue(ipsc?.toleranceValues)
    }, [ipsc])
    const submit = async () => {
        try {
            const id = searchParams.get('id')
            await firebaseFunctions('updateSetup', { toleranceValues, id, setupType: 'IPSC' })
            onClickOut()
            toast.success('Successful')
        } catch (error) {

        }
    }
    return (
        <>
            <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
            <div url='updateSetup' btnText={'Apply Settings'} onSubmit={submit} btnClass={'mx-auto my-[30px]'} className='fixed bottom-2 right-8 p-4 w-[500px] drop-shadow border p-2 rounded bg-white p'>
                <Text weight={600}>Table Settiings</Text>
                <div className='mt-[50px]'>
                    <Text color={'rgba(78, 78, 78, 0.5)'}>Define %Tolerance</Text>
                    <Divider />

                    <div className='flex justify-between my-[30px]'>
                        <Text weight={600} color={'#4E4E4E'}>Property</Text>
                        <Text weight={600} color={'#4E4E4E'}>Value</Text>
                    </div>

                    <Divider />

                    <div className='flex flex-col gap-2'>
                        {
                            values.map(
                                value => {
                                    return <div className='flex justify-between items-center h-[60px] border-b'>
                                        <Text weight={600} color={'#4E4E4E'}>{value.title}</Text>
                                        <Input type='number' defaultValue={toleranceValues?.[value.name]} onChange={(e) => setTolenranceValue(prev => ({ ...prev, [e.target.name]: e.target.value }))} name={value.name} containerClass='max-w-[100px]' inputClass={' text-center'} />
                                    </div>
                                }
                            )
                        }
                    </div>

                </div>
                {user.permitted.createAndeditIPSC && <Button className={'mx-auto my-[30px]'} onClick={submit} width={200}>Apply Settings</Button>}
            </div>
        </>)
}

export default ToleranceSettiings