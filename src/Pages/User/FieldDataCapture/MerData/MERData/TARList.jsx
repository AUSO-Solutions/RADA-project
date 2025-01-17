import dayjs from 'dayjs'
import { useMe } from 'hooks/useMe'
import { useGetSetups } from 'hooks/useSetups'
import BroadCast from 'Partials/BroadCast'
import Attachment from 'Partials/BroadCast/Attachment'
import BroadCastSuccessfull from 'Partials/BroadCast/BroadCastSuccessfull'
import SelectGroup from 'Partials/BroadCast/SelectGroup'
import Files from 'Partials/Files'
import SetupStatus from 'Partials/SetupStatus'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openModal } from 'Store/slices/modalSlice'
import { createWellTitle } from 'utils'
import { deleteSetup } from 'utils/deleteSetup'

const TARList = () => {
    const { setups: data } = useGetSetups("tarResult")
    const dispatch = useDispatch();
    const { user } = useMe()

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">
            <Files files={data} actions={[
                { name: 'Edit', to: (file) => `/users/fdc/mer-data/tar-table?id=${file?.id}` },
                // {
                //     name: 'Upload TAR',
                //     to: (file) => null,
                //     onClick:(file)=> dispatch(openModal({title:"Upload TAR",component:<UploadTAR merResult={file} />})),
                //     hidden: (file) => file?.status === 'approved'
                // },
                {
                    name: user.permitted.broadcastData ? 'Broadcast' : "Share",
                    to: (file) => null, onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            setup={file}
                            link={`/users/fdc/mer-data/tar-table?id=${file?.id}`}
                            type={'TAR Data Result'}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast TAR Data Result'
                            subject={`${file?.asset} TAR Data Result ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} TAR Data Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} TAR Data Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    })),
                    hidden: (file) => (user.permitted.broadcastData || user.permitted.shareData) && file?.status === 'approved'
                },
                {
                    name: 'Delete', onClick: (file) => deleteSetup({ id: file?.id, setupType: 'tarResult' }), to: () => null,
                    hidden: (file) => user.permitted.createAndeditMERdata && file?.status !== 'approved'
                },
            ]} name={(file) => `${createWellTitle(file, 'TAR Data')}`} bottomRight={(file) => <SetupStatus setup={file} />} />

        </div>
    )
}

export default TARList