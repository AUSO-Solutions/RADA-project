
import dayjs from 'dayjs'
import BroadCast from 'Partials/BroadCast'
import Attachment from 'Partials/BroadCast/Attachment'
import BroadCastSuccessfull from 'Partials/BroadCast/BroadCastSuccessfull'
import SelectGroup from 'Partials/BroadCast/SelectGroup'
import Files from 'Partials/Files'
import React from 'react'
import { openModal } from 'Store/slices/modalSlice'
import { createWellTitle } from 'utils'
import { ImportWellTestSchedule } from '../ImportWellTestFile'
import { Button, Input } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from 'Store/slices/modalSlice'
import { setSetupData } from 'Store/slices/setupSlice'
import { useAssetNames } from 'hooks/useAssetNames'
import { useNavigate } from 'react-router-dom'
import { useGetSetups } from 'hooks/useSetups'
import { useMe } from 'hooks/useMe'
import SetupStatus from 'Partials/SetupStatus'
import { deleteSetup } from 'utils/deleteSetup'

const WellTestResults = () => {
    const setupData = useSelector(state => state?.setup)
    const { setups: data } = useGetSetups("wellTestResult")
    const { user } = useMe()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { assetNames } = useAssetNames()
    return (<>
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files files={data} actions={[
                { name: user.permitted.remarkWellTestSchedule ? 'Edit' : 'View', to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}&scheduleId=${file?.wellTestScheduleId}`, permitted: true },
                // { name: 'Create IPSC', to: (file) => `/users/fdc/well-test-data?page=ipsc&autoOPenSetupModal=yes` },
                { name: 'Create IPSC', to: (file) => `/users/fdc/well-test-data?page=ipsc&well-test-result-id=${file?.id}&autoOpenSetupModal=yes`,
                //  permitted: user.permitted.createAndeditIPSC ,
                    hidden: (file) => user.permitted.createAndeditIPSC && file?.status === 'approved'
                },
                {
                    name: user.permitted.broadcastData ? 'Broadcast' : "Share",
                    to: (file) => null,
                    onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            link={`/users/fdc/well-test-data?page=ipsc&well-test-result-id=${file?.id}`}
                            type={'Well Test Result'}
                            setup={file}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast Well Test Result'
                            subject={`${file?.asset} MER Data ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} Well Test Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} Well Test Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    })),
                    hidden: (file) => (user.permitted.broadcastData || user.permitted.shareData) && file?.status === 'approved'
                },
                {
                    name: 'Delete', onClick: (file) => deleteSetup({ id: file?.id, setupType: 'wellTestResult' }), to: () => null,
                    hidden: (file) => user.permitted.createAndeditWellTestResult && file?.status !== 'approved'
                },
            ]}
                name={(file) => `${createWellTitle(file, 'Well Test Result')}`}
                bottomRight={(file) => <SetupStatus setup={file} />}

            />
        </div>
        {user.permitted.createAndeditWellTestResult &&
            <div className='ml-4'>
                <Button onClick={() => dispatch(openModal({
                    component: <div className='flex flex-col gap-3 w-[400px]'>
                        <Input required defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
                            label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                            onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))}
                        />
                        <Input type='month' placeholder="Daily" label={'Month'} containerClass={'!w-[150px]'}
                            defaultValue={setupData?.month} required
                            onChange={(e) => dispatch(setSetupData({ name: 'month', value: e.target.value }))} />
                        <br />
                        <ImportWellTestSchedule type='wellTestResult' btnText={'Proceed'} onComplete={() => {
                            dispatch(closeModal())
                            navigate(`/users/fdc/well-test-data/well-test-table?from-file=yes`)
                        }} />
                        <br />

                    </div>, title: 'Import WellTest Result'
                }))}>
                    Import Well test result
                </Button>
            </div>
        }
    </>
    )


}

export default WellTestResults