import React from 'react'
import Table from 'Components/table'
import TableAction from 'Components/tableaction'

const UserData = () => {


    const actions = [
        { text: 'Accept', },
        { text: 'Modify', },
        { text: 'Rollback', },
        // { text: 'Delete', onClick: (params) => dispatch(openModal({ title: 'Delete Blog Post', content: <DeleteBlogPost data={params} isDeleted={(res) => setChange(res)} /> })) },
      ]
    


  return (
      <div style={{ padding: '10px 0px 70px 0px' }}>
        <Table
          columns={[
            { Header: ' Name', accessor: '' },
            { Header: 'Net OIl', accessor: '' },
            { Header: 'Produced Gas', accessor: '', },
            { Header: ' Export Gas', accessor: '' },
            { Header: ' Fuel Gas', accessor: '' },
            { Header: 'Flare Gas', accessor: '' },
            // { Header: 'Status', accessor: 'isActive',  },
            { Header: <></>, accessor: 'action', Cell: ({ row }) => <TableAction actions={actions} data={row.original} /> },
          ]}
        //   data={data}
        />
      </div >
  )
}

export default UserData