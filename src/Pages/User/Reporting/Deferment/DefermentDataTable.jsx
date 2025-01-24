import React, { useEffect, useState, useMemo } from "react";
import { useFetch } from "hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setSetupData } from "Store/slices/setupSlice";
import { images } from "Assets/images";
import { Setting2 } from "iconsax-react";
import { useSearchParams } from "react-router-dom";
import { useAssetNames } from "hooks/useAssetNames";
import { Input } from "Components";
import { useAssetByName } from "hooks/useAssetByName";
import DateRangePicker from "Components/DatePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import tableStyles from "../table.module.scss";
import { roundUp } from "utils";

const createOpt = (item) => ({ label: item, value: item });
const aggregationFrequency = ["Day", "Month", "Year"];
const headerStyle = {
  bgcolor: `rgba(239, 239, 239, 1) !important`,
  color: "black",
  fontWeight: "bold  !important",
};

const DefermentDataTable = ({ assetOptions = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const query = useSelector((state) => state?.setup);
  const setupData = useSelector((state) => state?.setup);
  const { assetNames } = useAssetNames();
  const assets = useAssetByName(setupData?.asset);
  const [frequency, setFrequency] = useState("Day");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [currFlowstation, setCurrFlowstation] = useState("All");
  const [tableData, setTableData] = useState([]);

  const res = useFetch({
    firebaseFunction: "getDefermentData",
    payload: {
      asset: query?.asset,
      startDate: query?.startDate,
      endDate: query.endDate,
    },
    refetch: query,
  });

  const data = useMemo(() => {
    if (res?.data) return JSON.parse(res?.data);
    return {};
  }, [res?.data]);

  const dailyData = useMemo(() => Object.values(data.dailyData || {}), [data]);
  const monthlyData = useMemo(
    () => Object.values(data.monthlyData || {}),
    [data]
  );
  const yearlyData = useMemo(
    () => Object.values(data.yearlyData || {}),
    [data]
  );

  const dailyAggregate = useMemo(
    () => Object.values(data.dailyAggregate || {}),
    [data]
  );
  const monthlyAggregate = useMemo(
    () => Object.values(data.monthlyAggregate || {}),
    [data]
  );
  const yearlyAggregate = useMemo(
    () => Object.values(data.yearlyAggregate || {}),
    [data]
  );

  const totalOil = useMemo(() => data.totalOil || 0, [data]);
  const totalGas = useMemo(() => data.totalGas || 0, [data]);

  console.log({
    dailyData,
    monthlyData,
    yearlyData,
    dailyAggregate,
    monthlyAggregate,
    yearlyAggregate,
    totalOil,
    totalGas,
  });

  useEffect(() => {
    if (frequency === "Month") {
      setTableData(monthlyData);
    } else if (frequency === "Year") {
      setTableData(yearlyData);
    } else {
      setTableData(dailyData);
    }
  }, [dailyData, frequency, monthlyData, yearlyData]);

  useEffect(() => {
    const asset = searchParams.get("asset") || assetNames?.[0];
    const flowstation = searchParams.get("flowstation") || "";
    const startDate =
      searchParams.get("startDate") ||
      dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const endDate =
      searchParams.get("endDate") ||
      dayjs().subtract(1, "day").format("YYYY-MM-DD");

    dispatch(setSetupData({ name: "asset", value: asset }));
    dispatch(setSetupData({ name: "flowstation", value: flowstation }));
    dispatch(setSetupData({ name: "startDate", value: startDate }));
    dispatch(setSetupData({ name: "endDate", value: endDate }));
  }, [dispatch, assetOptions, assetNames, searchParams]);

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    if (freq === "Day") {
      setDateFormat("DD-MM-YYYY");
    } else if (freq === "Month") {
      setDateFormat("MMM YYYY");
    } else {
      setDateFormat("YYYY");
    }
  };

  return (
    <div className="relative">
      <div className="w-full flex flex-row justify-between px-[32px] my-2">
        <div className="flex items-center justify-between gap-2">
          <img
            src={images.excelLogo}
            alt="Excel"
            className="w-[40px] h-[40px]"
          />
          <img src={images.pdfLogo} alt="Excel" className="w-[40px] h-[28px]" />
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
              required
              type="select"
              options={assetNames?.map((assetName) => ({
                value: assetName,
                label: assetName,
              }))}
              onChange={(e) => {
                setCurrFlowstation("All");
                setSearchParams((prev) => {
                  prev.set("asset", e?.value);
                  prev.delete("flowstation");
                  return prev;
                });
              }}
              value={{ value: setupData?.asset, label: setupData?.asset }}
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
              onChange={(e) => setCurrFlowstation(e?.value)}
              value={{ value: currFlowstation, label: currFlowstation }}
            />
          </div>
          <DateRangePicker
            startDate={setupData?.startDate}
            endDate={setupData?.endDate}
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
                onChange={(e) => handleFrequencyChange(e?.value)}
                value={{ value: frequency, label: frequency }}
                defaultValue={"Day"}
              />
            </div>
          </div>
        </div>
      </div>
      <TableContainer
        className={`m-auto border ${tableStyles.borderedMuiTable}`}
        sx={{ maxHeight: 700, overflowY: "auto" }}
      >
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1, // Ensure it's above other rows
              }}
            >
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Flowstation
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Production String
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Date
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Downtime
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Gross
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Net Oil
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Gas
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Deferment Category
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Deferment Description
              </TableCell>
            </TableRow>
            <TableRow
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1, // Ensure it's above other rows
              }}
            >
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                {frequency === "Day" ? "hour" : "day"}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                blpd
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                bopd
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                MMscf/d
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              ></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData
              .filter((well) =>
                currFlowstation !== "All"
                  ? currFlowstation === well.flowstation
                  : true
              )
              .sort((a, b) =>
                a.productionString.localeCompare(b.productionString)
              )
              .map((well, index) => (
                <TableRow key={`${well?.productionString}-${index}`}>
                  <TableCell align="center" colSpan={2}>
                    {well?.flowstation}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {well?.productionString}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {dayjs(well?.date).format(dateFormat)}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {roundUp(
                      frequency === "Day"
                        ? well?.downtime
                        : well?.downtime / 24.0
                    )}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {roundUp(well?.gross)}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {roundUp(well?.oil)}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {roundUp(well?.gas)}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {well?.defermentCategory}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {well?.defermentSubCategory}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DefermentDataTable;
