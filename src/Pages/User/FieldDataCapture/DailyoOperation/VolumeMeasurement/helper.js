import { store } from "Store"
import { setSetupData } from "Store/slices/setupSlice"

export const updateFlowstation = (flowStationIndex, key, value) => {
    const setupData = store.getState().setup
    if (setupData?.flowStations?.length) {
        // let measurementType = value
        let prevFlowstations = [...setupData?.flowStations]
        prevFlowstations[flowStationIndex] = { ...prevFlowstations[flowStationIndex], [key]: value }
        if (value) {
            store.dispatch(setSetupData({
                name: 'flowStations',
                value: prevFlowstations
            }))

        }
    }
}
export const updateFlowstationReading = (flowStationIndex, readingIndex, key, value) => {
    const setupData = store.getState().setup


    if (setupData?.flowStations?.length) {

        let prevReadings = []
        if(setupData?.flowStations[flowStationIndex]?.readings?.length){
            prevReadings = [...setupData?.flowStations[flowStationIndex]?.readings]
        }
        prevReadings[readingIndex] = { ...prevReadings[readingIndex], [key]: value }
        
        updateFlowstation(flowStationIndex, 'readings', prevReadings)
        // // }

    }


}