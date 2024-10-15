
import { useFetch } from 'hooks/useFetch'
import Files from 'Partials/Files'
import React from 'react'
import { createWellTitle } from 'utils'
import { ImportWellTestSchedule } from '../ImportWellTestFile'
import { Button, Input } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, openModal } from 'Store/slices/modalSlice'
import { setSetupData } from 'Store/slices/setupSlice'
import { useAssetNames } from 'hooks/useAssetNames'
import {  useNavigate } from 'react-router-dom'

const WellTestResults = () => {
    const setupData = useSelector(state => state?.setup)
    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestResult" } })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { assetNames } = useAssetNames()
    return (
        <div className=" flex flex-wrap gap-4 m-5 ">


            <Files files={data} actions={[
                { name: 'Edit', to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}&scheduleId=${file?.wellTestScheduleId}` },
                { name: 'Create IPSC', to: (file) => `/users/fdc/well-test-data?page=ipsc&well-test-result-id=${file?.id}&autoOpenSetupModal=yes` },
                { name: 'Delete', to: (file) => `` },
            ]} name={(file) => `${createWellTitle(file, 'Well Test Result')}`} />

            <br />
            <Button onClick={() => dispatch(openModal({
                component: <div>
                    <Input required defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
                        label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                        onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))}
                    />
                    <ImportWellTestSchedule type='wellTestResult' btnText={'Proceed'} onComplete={() => {
                        dispatch(closeModal())
                        navigate(`/users/fdc/well-test-data/well-test-table?from-file=yes`)
                    }} />
                    <br />


                    {/* <Button onClick={}>Submit</Button> */}

                </div>, title: 'Import WellTest Result'
            }))}>
                Import Well test result
            </Button>

        </div>
    )


}

export default WellTestResults