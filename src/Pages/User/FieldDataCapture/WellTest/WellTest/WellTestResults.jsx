
import dayjs from 'dayjs'
import { useFetch } from 'hooks/useFetch'
import BroadCast from 'Partials/BroadCast'
import Attachment from 'Partials/BroadCast/Attachment'
import BroadCastSuccessfull from 'Partials/BroadCast/BroadCastSuccessfull'
import SelectGroup from 'Partials/BroadCast/SelectGroup'
import Files from 'Partials/Files'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openModal } from 'Store/slices/modalSlice'
import { createWellTitle } from 'utils'
import { ImportWellTestSchedule } from '../ImportWellTestFile'
import { Button, Input } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, openModal } from 'Store/slices/modalSlice'
import { setSetupData } from 'Store/slices/setupSlice'
import { useAssetNames } from 'hooks/useAssetNames'
import {  useNavigate } from 'react-router-dom'

const WellTestResults = () => {

    const dispatch = useDispatch()
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
                {
                    name: 'Broadcast', to: (file) => null, onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            link={`/users/fdc/well-test-data?page=ipsc&well-test-result-id=${file?.id}`}
                            type={'Well Test Result'}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast Well Test Result'
                            subject={`${file?.asset} MER Data ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} Well Test Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} Well Test Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    }))
                },
            ]} name={(file) => `${createWellTitle(file, 'Well Test Result')}`}

            />

        </div>
    )


}

export default WellTestResults