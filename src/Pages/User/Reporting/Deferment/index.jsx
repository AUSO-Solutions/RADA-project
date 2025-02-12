import { useMemo, useState, useEffect, useRef } from "react";
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
import excelIcon from "Assets/images/excel.svg";
import pdfIcon from "Assets/images/pdf.svg";
import * as XLSX from "xlsx";
import { roundUp } from "utils";
import {
  Document,
  Page,
  Image,
  // Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { getRandomColor } from "./DefermentChart";
import { Button } from "Components";
import { OilAndGasDownloadReportChart, OilProductionChart } from "./OilProductionChart";

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
  const querys = useSelector((state) => state?.setup);
  const setupData = useSelector((state) => state?.setup);
  const assets = useAssetByName(setupData?.asset);
  const [currFlowstation, setCurrFlowstation] = useState("All");
  const [frequency, setFrequency] = useState("Day");
  const [chartType, setChartType] = useState("Production Deferment Profile");
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [dailyAggregate, setDailyAggregate] = useState([]);
  const [monthlyAggregate, setMonthlyAggregate] = useState([]);
  const [yearlyAggregate, setYearlyAggregate] = useState([]);
  const [oilScheduledDeferment, setOilScheduledDeferment] = useState({});
  const [oilUnscheduledDeferment, setOilUnscheduledDeferment] = useState({});
  const [oilThirdPartyDeferment, setOilThirdPartyDeferment] = useState({});
  const [gasScheduledDeferment, setGasScheduledDeferment] = useState({});
  const [gasUnscheduledDeferment, setGasUnscheduledDeferment] = useState({});
  const [gasThirdPartyDeferment, setGasThirdPartyDeferment] = useState({});
  const [chartImage, setChartImage] = useState(null);
  const [showChart, setShowChart] = useState(false);

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
    setDailyData(Object.values(data.dailyData || {}));
    setMonthlyData(Object.values(data.monthlyData || {}));
    setYearlyData(Object.values(data.yearlyData || {}));
    setDailyAggregate(Object.values(data.dailyAggregate || {}));
    setMonthlyAggregate(Object.values(data.monthlyAggregate || {}));
    setYearlyAggregate(Object.values(data.yearlyAggregate || {}));
    setOilScheduledDeferment(data.oilScheduledDeferment || {});
    setOilUnscheduledDeferment(data.oilUnscheduledDeferment || {});
    setOilThirdPartyDeferment(data.oilThirdPartyDeferment || {});
    setGasScheduledDeferment(data.gasScheduledDeferment || {});
    setGasUnscheduledDeferment(data.gasUnscheduledDeferment || {});
    setGasThirdPartyDeferment(data.gasThirdPartyDeferment || {});
  }, [res?.data]);

  const exportResultToExcel = () => {
    let tableData = [];
    if (frequency === "Day") {
      tableData = dailyData;
    } else if (frequency === "Month") {
      tableData = monthlyData;
    } else {
      tableData = yearlyData;
    }

    const data = generateReportData(frequency, tableData, query?.flowstation);

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
          <DefermentDataTable
            dailyData={dailyData}
            monthlyData={monthlyData}
            frequency={frequency}
            yearlyData={yearlyData}
          />
        ),
      },
      {
        title: "Chart",
        Component: (
          <DefermentChart
            dailyAggregate={dailyAggregate}
            monthlyAggregate={monthlyAggregate}
            yearlyAggregate={yearlyAggregate}
            oilScheduledDeferment={oilScheduledDeferment}
            oilUnscheduledDeferment={oilUnscheduledDeferment}
            oilThirdPartyDeferment={oilThirdPartyDeferment}
            gasScheduledDeferment={gasScheduledDeferment}
            gasUnscheduledDeferment={gasUnscheduledDeferment}
            gasThirdPartyDeferment={gasThirdPartyDeferment}
            chartType={chartType}
            frequency={frequency}
          />
        ),
      },
    ],
    [
      chartType,
      dailyAggregate,
      dailyData,
      frequency,
      gasScheduledDeferment,
      gasThirdPartyDeferment,
      gasUnscheduledDeferment,
      monthlyAggregate,
      monthlyData,
      oilScheduledDeferment,
      oilThirdPartyDeferment,
      oilUnscheduledDeferment,
      yearlyAggregate,
      yearlyData,
    ]
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
                  onClick={exportResultToExcel}
                />

                <img
                  src={pdfIcon}
                  alt="pdf"
                  className="w-[40px] h-[40px]"
                  onClick={() => setShowChart(true)}
                />

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
                  setSetupData({
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

          {((chartType === "Production Deferment Profile" && tab === 1) ||
            tab === 0) && (
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
                    }}
                    value={{ value: frequency, label: frequency }}
                    defaultValue={"Day"}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
      {showChart ? (
        <PDFComponent
          barData={dailyAggregate}
          setChartImage={setChartImage}
          asset={query.asset}
          query={query}
          oilScheduledDeferment={oilScheduledDeferment}
          oilUnscheduledDeferment={oilUnscheduledDeferment}
          oilThirdPartyDeferment={oilThirdPartyDeferment}
          gasScheduledDeferment={gasScheduledDeferment}
          gasUnscheduledDeferment={gasUnscheduledDeferment}
          gasThirdPartyDeferment={gasThirdPartyDeferment}
          showChart={showChart}
          setShowChart={setShowChart}
          chartImage={chartImage}
        />
      ) : (
        tabs[tab].Component
      )}

      {/* {!showChart && tabs[tab].Component} */}
    </div>
  );
};

export default DefermentReport;

const generateReportData = (frequency, tableData = [], flowstation) => {
  let data = [];
  if (frequency === "Month") {
    data = tableData
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
        flowstation !== "All" ? flowstation === well.Flowstation : true
      )
      .sort((a, b) =>
        a["Production String"].localeCompare(b["Production String"])
      );
  } else if (frequency === "Year") {
    data = tableData
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
        flowstation !== "All" ? flowstation === well.Flowstation : true
      )
      .sort((a, b) =>
        a["Production String"].localeCompare(b["Production String"])
      );
  } else {
    data = tableData
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
        flowstation !== "All" ? flowstation === well.Flowstation : true
      )
      .sort((a, b) =>
        a["Production String"].localeCompare(b["Production String"])
      );
  }
  return data;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  hiddenChartContainer: {
    display: "none",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  chartContainer: {
    width: "100%",
    height: 300,
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
const PDFComponent = ({
  barData,
  asset,
  query,
  oilScheduledDeferment,
  oilUnscheduledDeferment,
  oilThirdPartyDeferment,
  gasScheduledDeferment,
  gasUnscheduledDeferment,
  gasThirdPartyDeferment,
  setShowChart,
}) => {
  const chartRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [pdfUrl, setPdfUrl] = useState(null);

  const getBarChartData = (fluidType) => {
    return barData.map((item) => ({
      x: dayjs(item.date).format("DD-MM-YYYY"),
      "Scheduled Deferment": roundUp(
        fluidType === "Net Oil/Condensate"
          ? item.totalOilScheduled
          : item.totalGasScheduled
      ),
      "Unscheduled Deferment": roundUp(
        fluidType === "Net Oil/Condensate"
          ? item.totalOilUnscheduled
          : item.totalGasUnscheduled
      ),
      "Third-Party Deferment": roundUp(
        fluidType === "Net Oil/Condensate"
          ? item.totalOilThirdParty
          : item.totalGasThirdParty
      ),
      [[fluidType === "Net Oil/Condensate" ? "Total Oil" : "Total Gas"]]:
        roundUp(
          fluidType === "Net Oil/Condensate" ? item.totalOil : item.totalGas
        ),
    }));
  };

  const getPieChartData = (dataObject) => {
    const result = Object.entries(dataObject?.subs).map(([key, value]) => ({
      name: key,
      value: Number(roundUp(value)),
    }));
    const colors = Object.keys(dataObject?.subs).map(() => getRandomColor());
    return { data: result, colors };
  };

  const generatePdf = () => {
    return new Promise((resolve) => {
      Promise.all(
        chartRefs
          .filter((ref) => ref.current)
          .map(
            (ref) =>
              new Promise((resolve) => {
                const chartElement = ref.current;

                setTimeout(() => {
                  html2canvas(chartElement).then(
                    (canvas) => {
                      const imgData = canvas.toDataURL("image/png");
                      resolve(imgData);
                    },
                    () => resolve(null)
                  );
                });
              })
          )
      ).then((canvases) => {
        setPdfUrl(canvases);
        resolve(canvases);
      });
    });
  };

  const handleGeneratePDF = async () => {
    const imagesDataArray = await generatePdf();

    // const chartHeight = 300
    const chartsPerPage = 2;
    const totalCharts = imagesDataArray.length;
    const pages = [];
    let chartIndex = 0;

    while (chartIndex < totalCharts) {
      const chartsInPage = [];
      while (chartsInPage.length < chartsPerPage && chartIndex < totalCharts) {
        chartsInPage.push(imagesDataArray[chartIndex]);
        chartIndex++;
      }

      pages.push(
        <Page key={chartIndex} size={"A4"} style={{ padding: 20 }}>
          <View style={{ flexDirection: "column" }}>
            {chartsInPage.map((imgData, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Image src={imgData} />
              </View>
            ))}
          </View>
        </Page>
      );
    }

    const PdfDocument = <Document>{pages}</Document>;

    pdf(PdfDocument)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        console.log(url);
        setPdfUrl(url);
      });
  };

  const handleDownloadPDF = async () => {
    const imagesDataArray = await generatePdf();

    // const chartHeight = 300
    const chartsPerPage = 2;
    const totalCharts = imagesDataArray.length;
    const pages = [];
    let chartIndex = 0;

    while (chartIndex < totalCharts) {
      const chartsInPage = [];
      while (chartsInPage.length < chartsPerPage && chartIndex < totalCharts) {
        chartsInPage.push(imagesDataArray[chartIndex]);
        chartIndex++;
      }

      pages.push(
        <Page key={chartIndex} size={"A4"} style={{ padding: 20 }}>
          <View style={{ flexDirection: "column" }}>
            {chartsInPage.map((imgData, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Image src={imgData} />
              </View>
            ))}
          </View>
        </Page>
      );
    }

    const PdfDocument = <Document>{pages}</Document>;

    pdf(PdfDocument)
      .toBlob()
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Deferment Data`;
        link.click();
      });
  };

  return (
    <div className=" h-full w-full px-4">
      <div className="flex justify-start p-4 mb-4 items-center gap-4">
        <Button onClick={handleGeneratePDF} bgcolor={""} className={"px-3"}>
          Generate Report
        </Button>
        <Button onClick={handleDownloadPDF} bgcolor={""} className={"px-3"}>
          Download Pdf
        </Button>
        <Button
          onClick={() => setShowChart(false)}
          bgcolor={""}
          className={"px-3"}
        >
          Close
        </Button>
      </div>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"600px"}
          title="Report Preview"
          style={{ border: "1px solid black", marginTop: "20px" }}
        />
      )}

      <div
        style={styles.chartContainer}
        className="bg-[#fafafa] flex flex-col gap-4"
      >
        <div className="h-[500px]" ref={chartRefs[0]}>
        <OilAndGasDownloadReportChart chartType={"Oil"} {...query} />
        </div>
        <div className="h-[500px]" ref={chartRefs[1]}>
          <OilAndGasDownloadReportChart chartType={"Gas"} {...query} />
        </div>
        <div className="h-[500px]" ref={chartRefs[2]}>
          <BarChart
            chartData={getBarChartData("Net Oil/Condensate")}
            fluidType={"Net Oil/Condensate"}
            title={`${asset} Oil/Condensate Production Deferment Profile (bopd)`}
          />
        </div>
        <div className="h-[500px]" ref={chartRefs[3]}>
          <BarChart
            chartData={getBarChartData("Gas")}
            fluidType={"Gas"}
            title={`${asset} Gas Production Deferment Profile (MMscf/d)`}
          />
        </div>

        {oilScheduledDeferment?.total > 0 && (
          <div ref={chartRefs[4]}>
            <PieChart
              data={getPieChartData(oilScheduledDeferment).data}
              colors={getPieChartData(oilScheduledDeferment).colors}
              title={`${asset} Net Oil/Condensate Scheduled Deferment Chart (bopd)`}
              title_empty={"Test"}
            />
          </div>
        )}
        {oilUnscheduledDeferment?.total > 0 && (
          <div ref={chartRefs[5]}>
            <PieChart
              data={getPieChartData(oilUnscheduledDeferment).data}
              colors={getPieChartData(oilUnscheduledDeferment).colors}
              title={`${asset} Net Oil/Condensate Unscheduled Deferment Chart (bopd)`}
              title_empty={"Test"}
            />
          </div>
        )}

        {oilThirdPartyDeferment?.total > 0 && (
          <div ref={chartRefs[6]}>
            <PieChart
              data={getPieChartData(oilThirdPartyDeferment || {}).data}
              colors={getPieChartData(oilThirdPartyDeferment).colors}
              title={`${asset} Net Oil/Condensate Third-Party Deferment Chart (bopd)`}
              title_empty={"Test"}
            />
          </div>
        )}

        {gasScheduledDeferment?.total > 0 && (
          <div ref={chartRefs[7]}>
            <PieChart
              data={getPieChartData(gasScheduledDeferment).data}
              colors={getPieChartData(gasScheduledDeferment).colors}
              title={`${asset} Gas Scheduled Deferment Chart (MMscf/d)`}
              title_empty={"Test"}
            />
          </div>
        )}
        {gasUnscheduledDeferment?.total > 0 && (
          <div ref={chartRefs[8]}>
            <PieChart
              data={getPieChartData(gasUnscheduledDeferment).data}
              colors={getPieChartData(gasUnscheduledDeferment).colors}
              title={`${asset} Gas Unscheduled Deferment Chart (MMscf/d)`}
              title_empty={"Test"}
            />
          </div>
        )}

        {gasThirdPartyDeferment?.total > 0 && (
          <div ref={chartRefs[9]}>
            <PieChart
              data={getPieChartData(gasThirdPartyDeferment || {}).data}
              colors={getPieChartData(gasThirdPartyDeferment).colors}
              title={`${asset} Gas Third-Party Deferment Chart (MMscf/d)`}
              title_empty={"Test"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
