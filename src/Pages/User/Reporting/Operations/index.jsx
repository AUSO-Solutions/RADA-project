import { useMemo, useRef, useState } from "react";
import Header from "Components/header";
import Tab from "Components/tab";
import pdfIcon from "Assets/images/pdf.svg";
import { Setting2 } from "iconsax-react";
import { Button, Input, RadaForm } from "Components";
import { useAssetNames } from "hooks/useAssetNames";
import dayjs from "dayjs";
import RadaDatePicker from "Components/Input/RadaDatePicker";
import { setSetupData } from "Store/slices/setupSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "hooks/useFetch";
import PDFReport from "./PDFReport";
import { closeModal, openModal } from "Store/slices/modalSlice";
import { setLoadingScreen } from "Store/slices/loadingScreenSlice";
import { firebaseFunctions } from "Services";

const OperationsReport = () => {
  const [tab, setTab] = useState(0);
  const { assetNames } = useAssetNames();
  const query = useSelector((state) => state?.setup);
  const dispatch = useDispatch();
  const setupData = useSelector((state) => state?.setup);
  const selectedHourRef = useRef(null)

  const res = useFetch({
    firebaseFunction: "getOperationsData",
    payload: {
      asset: query.asset,
      date: query?.date,
    },
    refetch: query,
  });

  const data = useMemo(() => {
    if (res?.data) return JSON.parse(res?.data);
    return {};
  }, [res?.data]);

  const getDefaultDate = () => {
    const today = new Date();

    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 1);
    return dayjs(previousDate).format("YYYY-MM-DD");
  };

  const tabs = useMemo(
    () => [
      {
        title: "Report",
        Component: (
          <PDFReport data={data} date={query?.date} asset={query?.asset} />
        ),
      },
    ],
    [data, query?.asset, query?.date]
  );

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const hour = parseInt(selectedTime.split(":")[0], 10);

    if (hour < 7 || hour > 12) {
      alert("Please select a time between 07:00 and 12:00");
      e.target.value = "";
      selectedHourRef.current = null;
    } else {
      selectedHourRef.current = hour
    };
  }


  const schedule = async () => {
    const hour = selectedHourRef.current;

    if (!hour || hour < 7 || hour > 12) {
      alert("Please select a valid time before saving.");
      return;
    }

    try {
      dispatch(setLoadingScreen({ open: true }));
      const { data } = await firebaseFunctions("upsertOperationsReportSchedule", {
        hour,
      });
      console.log("Response:", data);
      dispatch(closeModal());
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      dispatch(setLoadingScreen({ open: false }));
    }
  };

  return (
    <div className="h-full relative">
      <Header name={"Production/Operations Report"} />
      <tabs
        style={{
          display: "flex",
          gap: "40px",
          paddingLeft: "40px",
          borderBottom: "1px solid rgba(230, 230, 230, 1)",
        }}
      >
        {tabs.map((x, i) => (
          <Tab
            key={`${x.title}-${i}`}
            text={x.title}
            active={i === tab}
            onClick={() => setTab(i)}
          />
        ))}
      </tabs>
      <div className="w-full flex flex-row justify-between px-[32px] my-2">
        <div className="flex items-center justify-between gap-2">
          <img
            src={pdfIcon}
            alt="pdf"
            className="w-[40px] h-[40px]"
            onClick={() => setTab(0)}
          />

          <Setting2
            variant={"Linear"}
            size={30}
            className="text-gray-500 hover:text-[#0274bd] transition-colors duration-200"
            onClick={() => dispatch(
              openModal({
                title: 'Schedule Report',
                component: (

                  <div className="flex gap-5 flex-row justify-center" >
                    <Input type="time"
                      id="time"
                      min="07:00"
                      max="12:00"
                      step="3600"
                      onChange={handleTimeChange} />
                    <Button onClick={schedule} >Schedule</Button>
                  </div>

                ),
              })
            )}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="w-[120px]">
            <Input
              placeholder={"Assets"}
              name="asset"
              required
              type="select"
              options={assetNames?.map((assetName) => ({
                value: assetName,
                label: assetName,
              }))}
              onChange={(e) => {
                dispatch(
                  setSetupData({
                    name: "asset",
                    value: e?.value,
                  })
                );
              }}
              value={{
                value: setupData.asset || "OML 24",
                label: setupData.asset || "OML 24",
              }}
            />
          </div>

          <RadaDatePicker
            onChange={(e) => {
              dispatch(
                setSetupData({
                  name: "date",
                  value: dayjs(e).format("YYYY-MM-DD"),
                })
              );
            }}
            value={setupData.date || getDefaultDate()}
            max={dayjs().format("YYYY-MM-DD")}
          />
        </div>
      </div>
      {tabs[tab].Component}
    </div>
  );
};

export default OperationsReport;
