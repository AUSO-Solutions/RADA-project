import { useMemo, useState, useEffect } from "react";
import ReconciledProductionDataTable from "./ProductionTable";
import { useAssetNames } from "hooks/useAssetNames";
import Header from "Components/header";
import Tab from "Components/tab";
import { useFetch } from "hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setSetupData } from "Store/slices/setupSlice";
import { Setting2 } from "iconsax-react";
import { Input } from "Components";
import { useAssetByName } from "hooks/useAssetByName";
import DateRangePicker from "Components/DatePicker";
import { setReconciledProductionData } from "Store/slices/reconciledProductionSlice";
import excelIcon from "Assets/images/excel.svg";
import * as XLSX from "xlsx";
import { roundUp } from "utils";

const createOpt = (item) => ({ label: item, value: item });
const aggregationFrequency = ["Day", "Month"];

const ProductionReport = () => {
  const { assetNames } = useAssetNames();
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const query = useSelector((state) => state?.setup);
  const setupData = useSelector((state) => state?.setup);
  const assets = useAssetByName(setupData?.asset);
  const [currFlowstation, setCurrFlowstation] = useState("All");
  const productionData = useSelector((state) => state?.reconciledProduction);
  const [frequency, setFrequency] = useState(productionData.frequency || "Day");

  const res = useFetch({
    firebaseFunction: "getReconciledProductionData",
    payload: {
      asset: query.asset,
      flowstation: query.flowstation,
      startDate: query?.startDate,
      endDate: query.endDate,
    },
    refetch: query,
  });

  const getDefaultDate = () => {
    const today = new Date();

    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 1);
    return dayjs(previousDate).format("YYYY-MM-DD");
  };

  const dailyData = useMemo(() => {
    if (res?.data) {
      const data = JSON.parse(res?.data) || {};
      return Object.values(data.dailyData || {});
    } else {
      return [];
    }
  }, [res?.data]);

  const monthlyData = useMemo(() => {
    if (res?.data) {
      const data = JSON.parse(res?.data) || {};
      return Object.values(data.monthlyData || {});
    } else {
      return [];
    }
  }, [res?.data]);

  useEffect(() => {
    const data = res?.data ? JSON.parse(res?.data) : {};
    dispatch(
      setReconciledProductionData({
        name: "monthlyData",
        value: Object.values(data.monthlyData || {}),
      })
    );
    dispatch(
      setReconciledProductionData({
        name: "dailyData",
        value: Object.values(data.dailyData || {}),
      })
    );
  }, [dispatch, res?.data]);

  const generateReportData = () => {
    let data = [];
    if (productionData?.frequency === "Month") {
      data = (productionData.monthlyData || [])
        .map((well) => ({
          Date: dayjs(well.date).format("MMM YYYY"),
          Flowstation: well.flowstation,
          "Production String": well.productionString,
          "Gross (blpd)": roundUp(well.gross),
          "Oil (bopd)": roundUp(well.oil),
          "Gas (MMscf/d)": roundUp(well.gas),
          "Water (blpd)": roundUp(well.water),
          "Downtime (days)": roundUp(well.downtime / 24),
          "Deferment Category": well.defermentCategory,
          "Deferment Subcategory": well.defermentSubCategory,
        }))
        .filter((well) =>
          productionData.flowstation !== "All"
            ? productionData.flowstation === well.Flowstation
            : true
        )
        .sort((a, b) =>
          a["Production String"].localeCompare(b["Production String"])
        );
    } else {
      data = (productionData.dailyData || [])
        .map((well) => ({
          Date: dayjs(well.date).format("DD-MM-YYYY"),
          Flowstation: well.flowstation,
          "Production String": well.productionString,
          "Gross (blpd)": roundUp(well.gross),
          "Oil (bopd)": roundUp(well.oil),
          "Gas (MMscf/d)": roundUp(well.gas),
          "Water (blpd)": roundUp(well.water),
          "Downtime (hrs)": roundUp(well.downtime),
          "Deferment Category": well.defermentCategory,
          "Deferment Subcategory": well.defermentSubCategory,
        }))
        .filter((well) =>
          productionData.flowstation !== "All"
            ? productionData.flowstation === well.Flowstation
            : true
        )
        .sort((a, b) =>
          a["Production String"].localeCompare(b["Production String"])
        );
    }

    return data;
  };

  const exportToExcel = () => {
    const data = generateReportData();
    // Convert JSON data to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { width: 12 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
    ];

    // Create a new workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the Excel file and trigger download
    XLSX.writeFile(wb, `Deferment_Report.xlsx`);
  };

  const tabs = useMemo(
    () => [
      {
        title: "Multi-variable Report",
        Component: (
          <ReconciledProductionDataTable
            dailyData={dailyData}
            monthlyData={monthlyData}
            frequency={frequency}
          />
        ),
      },
    ],
    [dailyData, frequency, monthlyData]
  );

  useEffect(() => {
    if (!query?.asset) {
      dispatch(
        setSetupData({
          name: "asset",
          value: "OML 24",
        })
      );
    }
  }, [dispatch, query]);

  return (
    <div className="h-full relative">
      <Header name={"Reconciled Production Report"} />

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
        {
          <>
            {tabs[tab]?.title === "Multi-variable Report" && (
              <div className="flex items-center justify-between gap-2">
                <img
                  src={excelIcon}
                  alt="Excel"
                  className="w-[40px] h-[40px]"
                  onClick={exportToExcel}
                />

                <Setting2
                  variant={"Linear"}
                  size={30}
                  className="text-gray-500 hover:text-[#0274bd] transition-colors duration-200"
                />
              </div>
            )}
          </>
        }

        <div className="flex items-center justify-center gap-2">
          <div className="w-[120px]">
            <Input
              placeholder={"Assets"}
              required
              type="select"
              options={assetNames?.map((assetName) => ({
                value: assetName,
                label: assetName,
              }))}
              onChange={(e) => {
                setCurrFlowstation("All");
                dispatch(
                  setSetupData({
                    name: "asset",
                    value: e?.value,
                  })
                );
                dispatch(
                  setSetupData({
                    name: "flowstation",
                    value: "All",
                  })
                );
                dispatch(
                  setReconciledProductionData({
                    name: "flowstation",
                    value: "All",
                  })
                );
              }}
              value={{
                value: setupData.asset || "OML 24",
                label: setupData.asset || "OML 24",
              }}
              defaultValue={"OML 24"}
            />
          </div>
          <div style={{ width: "150px" }}>
            <Input
              key={setupData?.asset}
              placeholder={"Flow Stations"}
              required
              type="select"
              options={[{ label: "All", value: "All" }].concat(
                assets.flowStations?.map(createOpt)
              )}
              onChange={(e) => {
                setCurrFlowstation(e?.value);
                dispatch(
                  setSetupData({
                    name: "flowstation",
                    value: e?.value,
                  })
                );
                dispatch(
                  setReconciledProductionData({
                    name: "flowstation",
                    value: e?.value,
                  })
                );
              }}
              value={{ value: currFlowstation, label: currFlowstation }}
            />
          </div>
          <DateRangePicker
            className="w-[220px]"
            startDate={setupData.startDate || getDefaultDate()}
            endDate={setupData.endDate || getDefaultDate()}
            onChange={(e) => {
              dispatch(
                setSetupData({
                  name: "startDate",
                  value: dayjs(e?.startDate).format("YYYY-MM-DD"),
                })
              );

              dispatch(
                setSetupData({
                  name: "endDate",
                  value: dayjs(e?.endDate).format("YYYY-MM-DD"),
                })
              );
            }}
          />

          <div className="flex items-center justify-normal gap-1">
            <div className="text-4">Frequency</div>
            <div className="w-[120px]">
              <Input
                placeholder={"Day"}
                required
                type="select"
                options={aggregationFrequency?.map((freq) => ({
                  value: freq,
                  label: freq,
                }))}
                onChange={(e) => {
                  setFrequency(e?.value);
                  dispatch(
                    setReconciledProductionData({
                      name: "frequency",
                      value: e?.value,
                    })
                  );
                }}
                value={{ value: frequency, label: frequency }}
                defaultValue={"Day"}
              />
            </div>
          </div>
        </div>
      </div>
      {tabs[tab].Component}
    </div>
  );
};

export default ProductionReport;
