import Header from 'Components/header'
import React from 'react'

const SurveyData = () => {
  return (
    <div>
         <Header
        name={'FG/SG Survey Data'}
        // btns={[
        //   { text: 'Create user', onClick: () => dispatch(openModal({ title: 'Create User', component: <CreateUser /> })) },
        //   { text: 'Import users', onClick: () => dispatch(openModal({ title: 'Import Users', component: <ImportUsers /> })) },
        //   {
        //     text: <>  <Button data={usersToDownloading} loading={downloadLoading} >{downloadLoading ? 'Loading...' : 'Download template '} </Button>  </>, onClick: () => downloadUser()
        //   },
        // ]}
      />
    </div>
  )
}

export default SurveyData