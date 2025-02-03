import { useEffect, useMemo, useState } from "react";
import Header from "Components/header";
import Tab from "Components/tab";
import pdfIcon from "Assets/images/pdf.svg";
import {
  //   Document,
  //   Page,
  //   Text,
  //   View,
  //   StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Setting2 } from "iconsax-react";
import { Input } from "Components";
import { useAssetNames } from "hooks/useAssetNames";
import dayjs from "dayjs";
import RadaDatePicker from "Components/Input/RadaDatePicker";
import { setSetupData } from "Store/slices/setupSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "hooks/useFetch";
import PDFReport from "./PDFReport";

const OperationsReport = () => {
  const [tab, setTab] = useState(0);
  const { assetNames } = useAssetNames();
  const query = useSelector((state) => state?.setup);
  const dispatch = useDispatch();
  const setupData = useSelector((state) => state?.setup);

  const res = useFetch({
    firebaseFunction: "getOperationsData",
    payload: {
      asset: query.asset,
      date: query?.date,
    },
    refetch: query,
  });

  useEffect(() => {
    const data = res?.data ? JSON.parse(res?.data) : {};
    console.log(data);
  }, [res?.data]);

  const getDefaultDate = () => {
    const today = new Date();

    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 1);
    return dayjs(previousDate).format("YYYY-MM-DD");
  };

  console.log(query);

  const tabs = useMemo(
    () => [
      {
        title: "Report",
        Component: <PDFReport />,
      },
    ],
    []
  );
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
          <PDFDownloadLink
            document={<PDFComponent data={[]} />}
            fileName="deferment-report.pdf"
          >
            <img src={pdfIcon} alt="pdf" className="w-[40px] h-[40px]" />
          </PDFDownloadLink>

          <Setting2
            variant={"Linear"}
            size={30}
            className="text-gray-500 hover:text-[#0274bd] transition-colors duration-200"
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

const PDFComponent = () => {
  return <div></div>;
};
