
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




const MERDataTestResults = () => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "merResult" } })
    const dispatch = useDispatch();

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">



            <Files files={data} actions={[
                { name: 'Edit', to: (file) => `/users/fdc/mer-data/mer-data-result-table?id=${file?.id}` },
                // { name: 'Create IPSC', to: (file) => `/users/fdc/well-test-data?page=ipsc&well-test-result-id=${file?.id}&autoOpenSetupModal=yes` },
                { name: 'Delete', to: (file) => `` },
                {
                    name: 'Broadcast', to: (file) => null, onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            link={`/users/fdc/mer-data/mer-data-result-table?id=${file?.id}`}
                            type={'MER Data Result'}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast MER Data Result'
                            subject={`${file?.asset} MER Data Result ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} MER Data Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} MER Data Result ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    }))
                },
            ]} name={(file) => `${createWellTitle(file, 'Mer Data')}`} />

        </div>
    )


}

export default MERDataTestResults