import Text from 'Components/Text'
import Setup from 'Partials/setup'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { store } from 'Store'
import { openModal } from 'Store/slices/modalSlice'
import { setSetupData } from 'Store/slices/setupSlice'
import WellTestCommitTable from './WellTestCommitTable'
import dayjs from 'dayjs'


const SelectChokes = ({ merResult }) => {
    const setup = useSelector(state => state.setup)
    const dispatch = useDispatch()
    const selectChoke = (resultData, chokeSize) => {
        const selectedChokeData = resultData?.chokes?.find(choke => choke?.chokeSize === chokeSize)
        const { chokes, ...toBeSaved } = resultData
        let data = {
            ...toBeSaved,
            ...selectedChokeData,
            noOfChokes: chokes?.length,
            isSelected: true
        }
        console.log(data)
        const prevWellTestResultData = setup?.wellTestResultData
        dispatch(setSetupData({ name: 'wellTestResultData', value: { ...prevWellTestResultData, [resultData?.productionString]: data } }))
        console.log({ ...prevWellTestResultData, [resultData?.productionString]: data })
    }
    // console.log({merResult})

    useEffect(() => {
        dispatch(setSetupData({ name: 'merResultId', value: merResult?.id }))
        dispatch(setSetupData({ name: 'asset', value: merResult?.asset }))
        dispatch(setSetupData({ name: 'month', value: merResult?.month }))
    }, [dispatch, merResult?.id, merResult?.asset, merResult?.month])
    return (<>
        <div className='border rounded py-2 px-4 w-fit bg-[lightgrey] mb-3'>
            {dayjs(merResult?.month).format('MMM YYYY')}
        </div>

        {/* <Input type='month' onChange={e => dispatch(setSetupData({ name: 'month', value: e.target.value }))} disabled value={{ label: setup?.month, value: setup?.month }} containerClass={'!w-fit self-right  p-2'} /> */}
        <div className='border rounded-[20px] w-full py-3'>
            <div className='flex justify-between items-center py-3 border-b px-2'>
                <Text>
                    Well
                </Text>
                <Text>
                    Current Choke
                </Text>
            </div>

            <div className='flex flex-col'>
                {
                    Object.values(merResult?.merResultData || {}).map(
                        resultData => <div className='flex justify-between items-center py-3 py-3 border-b px-2'>
                            <Text>
                                {resultData?.productionString}
                            </Text>
                            <select required className='border px-5 outline-none py-1 rounded' defaultValue={setup?.wellTestResultData?.[resultData?.productionString]?.chokeSize} onChange={(e) => {
                                selectChoke(resultData, e.target.value)
                            }}>
                                <option value=""> Select choke</option>
                                {
                                    resultData?.chokes?.map(choke => <option value={choke?.chokeSize}> {choke?.chokeSize}</option>)
                                }
                            </select>
                        </div>
                    )
                }
            </div>
        </div></>
    )
}

const Preview = ({ merResult }) => {
    const setup = useSelector(state => state.setup)

    return (
        <div className='border rounded-[20px] w-full py-3'>

            <div className='flex justify-between items-center py-3 border-b px-2'>
                <Text>
                    Well
                </Text>
                <Text>
                    Current Choke
                </Text>
            </div>

            <div className='flex flex-col'>
                {
                    Object.values(setup?.wellTestResultData || {}).map(
                        resultData => <div className='flex justify-between items-center py-3 py-3 border-b px-2'>
                            <Text>
                                {resultData?.productionString}
                            </Text>
                            <Text className={'bg-[lightgrey] rounded border text-center px-2 w-[70px]'} align={'center'}>
                                {setup?.wellTestResultData?.[resultData?.productionString]?.chokeSize}
                            </Text>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const ExtractWellTest = ({ merResult }) => {
    const [, setSearchParaams] = useSearchParams()
    useEffect(() => {
        setSearchParaams(prev => {
            prev.set('autoOpenSetupModal', '1')
            return prev
        })
    }, [setSearchParaams])
    const dispatch = useDispatch()
    const save = async () => {
        const setup = store.getState().setup
     
        dispatch(openModal({ component: <WellTestCommitTable wellTestResult={setup?.wellTestResultData} merResult={merResult} /> }))

    }
    const [loading,] = useState(false)
    return (
        <Setup
            title={'Extract Well Test'}
            steps={["Select Choke Size", "Preview"]}
            rightBtnLoading={loading}
            stepComponents={
                [
                    <SelectChokes merResult={merResult} />, <Preview />
                ]
            }
            onSave={save}
        />

    )
}

export default ExtractWellTest