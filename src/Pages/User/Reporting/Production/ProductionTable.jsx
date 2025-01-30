import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import tableStyles from "../table.module.scss";
import { roundUp } from "utils";

const headerStyle = {
  bgcolor: `rgba(239, 239, 239, 1) !important`,
  color: "black",
  fontWeight: "bold  !important",
};

const ReconciledProductionDataTable = () => {
  const productionData = useSelector((state) => state?.reconciledProduction);
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");

  const initialState = () => {
    if (productionData.frequency === "Month") {
      return productionData.monthlyData || [];
    } else {
      return productionData.dailyData || [];
    }
  };
  console.log(productionData);

  const [tableData, setTableData] = useState(initialState);

  useEffect(() => {
    if (productionData?.frequency === "Month") {
      setTableData(productionData.monthlyData || []);
    } else {
      setTableData(productionData.dailyData || []);
    }
  }, [productionData]);

  useEffect(() => {
    if (productionData.frequency === "Day") {
      setDateFormat("DD-MM-YYYY");
    } else if (productionData.frequency === "Month") {
      setDateFormat("MMM YYYY");
    } else {
      setDateFormat("YYYY");
    }
  }, [productionData.frequency]);

  return (
    <div className="relative">
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
          </TableHead>
          <TableRow>
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
              {productionData.frequency === "Day" ? "hour" : "day"}
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
          <TableBody>
            {tableData
              .filter((well) =>
                productionData.flowstation !== "All"
                  ? productionData.flowstation === well.flowstation
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
                      productionData.frequency === "Day"
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

export default ReconciledProductionDataTable;
