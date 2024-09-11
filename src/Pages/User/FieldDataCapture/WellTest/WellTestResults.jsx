
import { useFetch } from 'hooks/useFetch'
import Files from 'Partials/Files'
import React from 'react'




const WellTestResults = () => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestResult" } })

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files files={data} actions={[
                { name: 'Edit', to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}&scheduleId=${file?.wellTestScheduleId}` },
                { name: 'Delete', to: (file) => `` },
            ]} />
          
        </div>
    )


}

export default WellTestResults