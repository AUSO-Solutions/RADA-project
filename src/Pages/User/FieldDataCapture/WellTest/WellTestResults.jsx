import { images } from 'Assets'
import Text from 'Components/Text'
import { useFetch } from 'hooks/useFetch'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const WellTestResults = () => {
  

        // const setupData = useSelector(state => state.setup)
        // const dispatch = useDispatch()
        const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestResult" } })
        const [menuViewed, setMenuViewed] = useState(null)
        const viewMenu = (i) => {
            setMenuViewed(prev => {
                if (prev === i) return null
                return i
            })
        }
        return (
            <div className=" flex flex-wrap gap-4 m-5 ">
                {data?.map((datum, i) => <div onClick={() => viewMenu(i)} className="w-[250px] relative shadow rounded-[8px] px-3 flex items-center gap-3">
                    <img src={images.file} alt="" width={100} />   <Text size={18}> {datum?.title}</Text>
                    {
                        menuViewed === i && <div className="absolute w-[100px] shadow !z-[100] flex flex-col gap-2 px-2 right-[-50px] border rounded shadow bottom-[-30px] bg-[white]">
                            {/* <Link to={`/users/fdc/well-test-data/schedule-table?id=${datum?.id}`} >Remark</Link> */}
                            <Link to={`/users/fdc/well-test-data/well-test-table?id=${datum?.id}&scheduleId=${datum?.wellTestScheduleId}`} >Edit </Link>
                            <div>Delete</div>
                        </div>
                    }
                </div>)}
            </div>
        )
    
  
}

export default WellTestResults