
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { closeModal, openModal } from 'Store/slices/modalSlice'

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import TableAction from 'Components/RadaTable/TableAction'
import ConfirmModal from 'Components/Modal/ConfirmModal'
// import { deleteUser } from './deleteUser'
// import ImportUsers from './importUsers'
// import { downloadTemplate } from '../users/downloadTemplate'

import { firebaseFunctions } from 'Services'

import CreateAsset from './CreateAsset'
import { toast } from 'react-toastify'
import ImportMasterXY from './ImportMasterXY'

const Assets = () => {
    const dispatch = useDispatch()
    // const [downloadLoading, setDownloading] = useState(false)
    // const [usersToDownloading] = useState([])

    // const downloadUser = async () => {
    //     setDownloading(true)
    //     if (downloadLoading) return;
    //     try {
    //         const users = await firebaseFunctions("getUsers")
    //         let list = users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName, email: user?.email, })) || []
    //         list.unshift({ "firstName": "firstName", "lastName": "lastName", "email": "email" })
    //         // setUsertoDownload(users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName,  email: user?.email, })))
    //         downloadTemplate(list)
    //     } catch (error) {

    //     } finally {
    //         setDownloading(false)
    //     }
    // }


    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteAsset = async (listId, assetName,onComplete=()=>null) => {
        setDeleteLoading(true)
        try {
            await firebaseFunctions("deleteAssetById", { listId, assetName })
            onComplete()
            toast.success("Successful")
        } catch (error) {

        } finally {
            setDeleteLoading(false)
        }

    }



    return (
        <div>
            <Header
                name={'Manage Assets'}
                btns={[
                    { text: 'Create Asset', onClick: () => dispatch(openModal({ title: 'Create Asset', component: <CreateAsset /> })) },
                    { text: 'Import MasterXY', onClick: () => dispatch(openModal({ title: 'Import MasterXY', component: <ImportMasterXY /> })) },
                    // {   text: <>  <Button data={usersToDownloading} loading={downloadLoading} >{downloadLoading ? 'Loading...' : 'Download template '} </Button>  </>, onClick: () => downloadUser() },
                ]}
            />
            <RadaTable
                firebaseApi='getAssets'

                
                columns={[
                    { name: 'OML', key: 'assetName' },
                    { name: 'Field', key: 'field' },
                    { name: 'Well', key: 'well' },
                    // { name: 'Production string', key: 'productionString' },
                    { name: 'Reservoir', key: 'reservoir' },
                    { name: 'Flowstation', key: 'flowStation' },
                    { name: 'Surface X Coordinate', key: 'surfaceX' },
                    { name: 'Surface Y Coordinate', key: 'surfaceY' },

                ]}
                actions={(data, i) => <TableAction
                    actions={[
                        { component: 'Update asset', onClick: () => dispatch(openModal({ title: 'Update asset', component: <CreateAsset defaultValues={data} /> })) },
                        { component: 'Delete asset', onClick: () => dispatch(openModal({ title: 'Delete asset', component: <ConfirmModal color='red' loading={deleteLoading} onProceed={() => deleteAsset(data?.listId, data?.assetName, () => dispatch(closeModal()))} /> })) },
                    ]}
                />}
            />
        </div>
    )
}

export default Assets