
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { closeModal, openModal } from 'Store/slices/modalSlice'

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import TableAction from 'Components/RadaTable/TableAction'
import ConfirmModal from 'Components/Modal/ConfirmModal'
// import { deleteUser } from './deleteUser'
// import ImportUsers from './importUsers'
import { downloadTemplate } from '../users/downloadTemplate'

import { firebaseFunctions } from 'Services'
import { Button } from 'Components'
import CreateAsset from './CreateAsset'
import { toast } from 'react-toastify'
// import { CSVDownload } from 'react-csv';
// import { toast } from 'react-toastify'


const Assets = () => {
    const dispatch = useDispatch()
    const [downloadLoading, setDownloading] = useState(false)
    const [usersToDownloading] = useState([])

    const downloadUser = async () => {
        setDownloading(true)
        if (downloadLoading) return;
        try {
            const users = await firebaseFunctions("getUsers")
            let list = users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName, email: user?.email, })) || []
            list.unshift({ "firstName": "firstName", "lastName": "lastName", "email": "email" })
            // setUsertoDownload(users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName,  email: user?.email, })))
            downloadTemplate(list)
        } catch (error) {

        } finally {
            setDownloading(false)
        }
    }
    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteAsset = async (id) => {
        setDeleteLoading(true)
        try {
            await firebaseFunctions("deleteAssetById", { id })
            toast.success("Successful")
        } catch (error) {

        }finally{
            setDeleteLoading(false)
        }

    }



    return (
        <div>
            <Header
                name={'Manage Assets'}
                btns={[
                    { text: 'Create Asset', onClick: () => dispatch(openModal({ title: 'Create Asset', component: <CreateAsset /> })) },
                    //   { text: 'Import users', onClick: () => dispatch(openModal({ title: 'Import Users', component: <ImportUsers /> })) },
                    // {   text: <>  <Button data={usersToDownloading} loading={downloadLoading} >{downloadLoading ? 'Loading...' : 'Download template '} </Button>  </>, onClick: () => downloadUser() },
                ]}
            />
            <RadaTable
                firebaseApi='getAssets'
                columns={[
                    { name: 'OML', key: 'name' },
                    { name: 'Field', key: 'field' },
                    { name: 'Well', key: 'well' },
                    { name: 'Production string', key: 'productionString' },
                    { name: 'Reservoir', key: 'reservoir' },
                    { name: 'Flowstation', key: 'flowStation' },
                    { name: 'Surface X Coordinate', key: 'surfaceXcoordinate' },
                    { name: 'Surface Y Coordinate', key: 'surfaceYcoordinate' },

                ]}
                actions={(data, i) => <TableAction
                    actions={[
                        { component: 'Update asset', onClick: () => dispatch(openModal({ title: 'Update asset', component: <CreateAsset defaultValues={data} /> })) },
                        { component: 'Delete asset', onClick: () => dispatch(openModal({ title: 'Delete asset', component: <ConfirmModal color='red' loading={deleteLoading} onProceed={() => deleteAsset(data?.id, () => dispatch(closeModal()))} /> })) },
                    ]}
                />}
            />
        </div>
    )
}

export default Assets