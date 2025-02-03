import React, { useEffect, useState } from "react";
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

const ReconciledProductionDataTable = ({
  monthlyData,
  dailyData,
  frequency,
}) => {
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (frequency === "Month") {
      const data = monthlyData.map((item) => ({
        ...item,
        uptimeProduction: item?.uptimeProduction / 24.0 || 0,
      }));
      setTableData(data || []);
      setDateFormat("MMM YYYY");
    } else {
      setTableData(dailyData || []);
      setDateFormat("DD-MM-YYYY");
    }
  }, [dailyData, frequency, monthlyData]);

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
                Producing Days
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Bean-size
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                THP
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
                Water
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Gas
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
              {frequency === "Day" ? "hour" : "day"}
            </TableCell>
            <TableCell
              style={{ fontWeight: "600" }}
              align="center"
              colSpan={2}
              sx={headerStyle}
            >
              /64
            </TableCell>
            <TableCell
              style={{ fontWeight: "600" }}
              align="center"
              colSpan={2}
              sx={headerStyle}
            >
              psi
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
              blpd
            </TableCell>
            <TableCell
              style={{ fontWeight: "600" }}
              align="center"
              colSpan={2}
              sx={headerStyle}
            >
              MMscf/d
            </TableCell>
          </TableRow>
          {tableData.length > 0 && (
            <TableBody>
              {tableData
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
                      {roundUp(well?.uptimeProduction)}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {well?.bean !== 0 ? well?.bean : ""}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {well?.thp !== 0 ? well?.thp : ""}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {roundUp(well?.gross)}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {roundUp(well?.oil)}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {roundUp(well?.water)}
                    </TableCell>
                    <TableCell align="center" colSpan={2}>
                      {roundUp(well?.gas)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReconciledProductionDataTable;
