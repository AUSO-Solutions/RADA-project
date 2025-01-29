import { useMemo, useState, useEffect } from "react";
import DefermentDataTable from "./DefermentDataTable";
import DefermentChart from "./DefermentChart";
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
import { setDefermentData } from "Store/slices/defermentSlice";
import excelIcon from "Assets/images/excel.svg";
import pdfIcon from "Assets/images/pdf.svg";
import * as XLSX from "xlsx";
import { roundUp } from "utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const createOpt = (item) => ({ label: item, value: item });
const aggregationFrequency = ["Day", "Month", "Year"];
const chartTypes = [
  "Production Deferment Profile",
  "Scheduled Deferment",
  "Unscheduled Deferment",
  "Third Party Deferment",
];

const DefermentReport = () => {
  const { assetNames } = useAssetNames();
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const query = useSelector((state) => state?.setup);
  const setupData = useSelector((state) => state?.setup);
  const assets = useAssetByName(setupData?.asset);
  const [currFlowstation, setCurrFlowstation] = useState("All");
  const defermentData = useSelector((state) => state?.deferments);
  const [frequency, setFrequency] = useState(defermentData.frequency || "Day");
  const [chartType, setChartType] = useState(
    defermentData.chartType || "Production Deferment Profile"
  );

  const res = useFetch({
    firebaseFunction: "getDefermentData",
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

  useEffect(() => {
    const data = res?.data ? JSON.parse(res?.data) : {};
    dispatch(
      setDefermentData({
        name: "monthlyData",
        value: Object.values(data.monthlyData || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "dailyData",
        value: Object.values(data.dailyData || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "yearlyData",
        value: Object.values(data.yearlyData || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "dailyAggregate",
        value: Object.values(data.dailyAggregate || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "monthlyAggregate",
        value: Object.values(data.monthlyAggregate || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "yearlyAggregate",
        value: Object.values(data.yearlyAggregate || {}),
      })
    );
    dispatch(
      setDefermentData({
        name: "oilScheduledDeferment",
        value: data.oilScheduledDeferment || {},
      })
    );
    dispatch(
      setDefermentData({
        name: "oilUnscheduledDeferment",
        value: data.oilUnscheduledDeferment || {},
      })
    );
    dispatch(
      setDefermentData({
        name: "oilThirdPartyDeferment",
        value: data.oilThirdPartyDeferment || {},
      })
    );
    dispatch(
      setDefermentData({
        name: "gasScheduledDeferment",
        value: data.gasScheduledDeferment || {},
      })
    );
    dispatch(
      setDefermentData({
        name: "gasUnscheduledDeferment",
        value: data.gasUnscheduledDeferment || {},
      })
    );
    dispatch(
      setDefermentData({
        name: "gasThirdPartyDeferment",
        value: data.gasThirdPartyDeferment || {},
      })
    );
  }, [dispatch, res?.data]);

  const generateReportData = () => {
    let data = [];
    if (defermentData?.frequency === "Month") {
      data = (defermentData.monthlyData || [])
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
          defermentData.flowstation !== "All"
            ? defermentData.flowstation === well.Flowstation
            : true
        )
        .sort((a, b) =>
          a["Production String"].localeCompare(b["Production String"])
        );
    } else if (defermentData?.frequency === "Year") {
      data = (defermentData.yearlyData || [])
        .map((well) => ({
          Date: dayjs(well.date).format("YYYY"),
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
          defermentData.flowstation !== "All"
            ? defermentData.flowstation === well.Flowstation
            : true
        )
        .sort((a, b) =>
          a["Production String"].localeCompare(b["Production String"])
        );
    } else {
      data = (defermentData.dailyData || [])
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
          defermentData.flowstation !== "All"
            ? defermentData.flowstation === well.Flowstation
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
        Component: <DefermentDataTable />,
      },
      {
        title: "Chart",
        Component: <DefermentChart />,
      },
    ],
    []
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
      <Header name={"Production Deferment Report"} />

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
                <PDFDownloadLink
                  document={<PDFComponent data={generateReportData()} />}
                  fileName="deferment-report.pdf"
                >
                  <img
                    src={pdfIcon}
                    alt="Excel"
                    className="w-[40px] h-[40px]"
                  />
                </PDFDownloadLink>

                <Setting2
                  variant={"Linear"}
                  size={30}
                  className="text-gray-500 hover:text-[#0274bd] transition-colors duration-200"
                />
              </div>
            )}

            {tabs[tab]?.title === "Chart" && (
              <div className="w-[220px]">
                <Input
                  placeholder={"Production Deferment Profile"}
                  required
                  type="select"
                  options={chartTypes?.map((chartType) => ({
                    value: chartType,
                    label: chartType,
                  }))}
                  onChange={(e) => {
                    setChartType(e?.value);
                    dispatch(
                      setDefermentData({
                        name: "chartType",
                        value: e?.value,
                      })
                    );
                  }}
                  value={{ value: chartType, label: chartType }}
                  defaultValue={"Production Deferment Profile"}
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
                  setDefermentData({
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
                  setDefermentData({
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
                    setDefermentData({
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

export default DefermentReport;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 8, // Set font size for title to 8 (smallest)
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "20px 0",
  },
  tableRow: {
    flexDirection: "row",
    // borderBottom: "1px dashed black",
    padding: 1, // Vertical padding in rows
  },
  tableCol: {
    width: "11.11%", // Each column takes up 1/9 of the table (100% / 9 columns)
    padding: "1px 1px", // Reduced horizontal padding in cells
    borderRight: "1px dashed black", // Dashed border for right side
    borderBottom: "1px dashed black", // Dashed border for bottom side
  },
  tableCell: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  headerText: {
    fontSize: 4,
    fontWeight: "bold",
  },
  rowText: {
    fontSize: 4,
  },
});

// Create a PDF Document with a Table
const PDFComponent = ({ data }) => {
  const headers = Object.keys(data[0] || {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {headers.map((header, index) => (
              <Text
                key={`${header}-${index}`}
                style={[styles.tableCol, styles.headerText]}
              >
                {header}
              </Text>
            ))}
          </View>
          {data.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              {headers.map((header, index) => (
                <Text
                  key={`${header}-${index}`}
                  style={[styles.tableCol, styles.rowText]}
                >
                  {row[header]}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

//   return (
//     <div>
//       {/* The PDFDownloadLink component allows the user to download the generated PDF */}
// <PDFDownloadLink document={<MyDocument />} fileName="table.pdf">
//   {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
// </PDFDownloadLink>
//     </div>
//   );
// };

// export default ExportPDF;
