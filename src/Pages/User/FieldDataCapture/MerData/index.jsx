import Header from 'Components/header'
import React, { useMemo } from 'react'
import Tab from 'Components/tab'
import Schedule from './Schedule/Schedule'
// import IPSC from './IPSC'
// import WellTestResults from './WellTest/WellTestResults'
// import CreateIPSC from './IPSC/CreateIPSC'
import { useLocation, useNavigate } from 'react-router-dom'
import MERDataTestResults from './MERData/MERDataTestResults'
// import MERDataTable from './MERData/MERDataTable'


const tabs = [
  {
    title: 'Schedules',
    Component: <Schedule />
  },
  {
    title: 'MER Result',
    Component: <MERDataTestResults />
  },
  // {
  //   title: 'IPSC',
  //   Component: <CreateIPSC />
  // },
]
const MERData = () => {
  const navigate = useNavigate()

  // const [tab, setTab] = useState(0)
  const { search } = useLocation()
  const toPage = str => str.replaceAll(' ', '-').toLowerCase()
  const currTab = useMemo(() => {

    const page = new URLSearchParams(search).get("page")
    const index = tabs.findIndex(tab => toPage(tab.title) === page)
    return index >= 0 ? index : 0
  }, [search])
  return (
    <div className='h-[100%] '>
      <div className='flex flex-row items-center ' >
        <Header
          name={'MER Data'}
        />
          
      </div>
      < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
        {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === currTab} onClick={() => navigate(`/users/fdc/mer-data?page=${toPage(x.title)}`)} />)}
      </ tabs>
      {
        tabs[currTab].Component
      }

    </div>
  )
}

export default MERData