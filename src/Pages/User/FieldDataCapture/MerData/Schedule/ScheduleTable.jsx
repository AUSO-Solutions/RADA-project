import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import tableStyles from "../table.module.scss";
import RadaSwitch from "Components/Input/RadaSwitch";
import { ArrowBack } from "@mui/icons-material";
import Text from "Components/Text";
import { Button } from "Components";
import { Link, useLocation } from "react-router-dom";
import { useFetch } from "hooks/useFetch";
import dayjs from "dayjs";
import { firebaseFunctions } from "Services";
import { toast } from "react-toastify";
import { useMe } from "hooks/useMe";
import Actions from "Partials/Actions/Actions";
import { Query } from "Partials/Actions/Query";
import { Approve } from "Partials/Actions/Approve";
import { openModal } from "Store/slices/modalSlice";
import { useDispatch } from "react-redux";
import { createWellTitle } from "utils";
import { Box } from "@mui/material";

export default function MERScheduleTable() {
  const { user } = useMe();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [merSchedule, setMerSchedule] = React.useState({});
  const id = React.useMemo(
    () => new URLSearchParams(search).get("id"),
    [search]
  );
  const { data: res } = useFetch({
    firebaseFunction: "getSetup",
    payload: { setupType: "merSchedule", id },
  });
  React.useEffect(() => {
    setMerSchedule(res);
  }, [res]);
  const save = async () => {
    setLoading(true);
    try {
      await firebaseFunctions("updateSetup", {
        id,
        setupType: "merSchedule",
        ...merSchedule,
      });
      toast.success("Remark saved successfully");
      console.log(res, merSchedule);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const headerStyle = {
    bgcolor: `rgba(239, 239, 239, 1) !important`,
    color: "black",
    fontWeight: "bold  !important",
  };

  return (
    <div className="px-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 py-4 items-center">
          <Link
            to={"/users/fdc/well-test-data/"}
            className="flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md"
          >
            <ArrowBack />
            <Text>Files</Text>
          </Link>
          <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        {(user.permitted.approveData || user.permitted.queryData) && (
          <Actions
            actions={[
              {
                name: "Query Result",
                onClick: () =>
                  dispatch(
                    openModal({
                      component: (
                        <Query
                          header={"Query MER Schedule"}
                          id={merSchedule?.id}
                          setupType={"merSchedule"}
                          title={createWellTitle(merSchedule)}
                          pagelink={pathname + search}
                        />
                      ),
                    })
                  ),
                permitted: user.permitted.queryData,
              },
              {
                name: "Approve",
                onClick: () =>
                  dispatch(
                    openModal({
                      component: (
                        <Approve
                          header={"Approve MER Schedule"}
                          id={merSchedule?.id}
                          setupType={"merSchedule"}
                          pagelink={pathname + search}
                          title={createWellTitle(merSchedule)}
                        />
                      ),
                    })
                  ),
                permitted: user.permitted.approveData,
              },
            ].filter((x) => x.permitted)}
          />
        )}
      </div>
      <TableContainer
        sx={{ maxHeight: 700 }}
        className={`m-auto border ${tableStyles.borderedMuiTable}`}
      >
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={11}
                sx={headerStyle}
              >
                MER DATA-{merSchedule?.asset}/Mer Schedule/
                {dayjs(merSchedule?.created).format("MMM YYYY")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                S/N
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Reservoir
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Production string
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Test Choke (/64")
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                On Program
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Start Date
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                End Date
              </TableCell>
              {/* <TableCell style={{ fontWeight: '600' }} align="center">Stabilization Duration (Hrs)</TableCell> */}
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Test Duration (Hrs)
              </TableCell>{" "}
              <TableCell
                style={{ fontWeight: "600" }}
                colSpan={1}
                align="center"
                sx={headerStyle}
              >
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>

          {Object.values(merSchedule?.merScheduleData || {}).map((mer, i) => {
            const merBorder = (i) =>
              mer?.chokes?.length !== i + 1 ? ".1px lightgrey solid" : "";
            return (
              <>
                <TableBody className="flex w-fit">
                  <TableRow>
                    <TableCell align="center">{i + 1}</TableCell>
                    <TableCell align="center">{mer?.reservoir}</TableCell>
                    <TableCell align="center">
                      {mer?.productionString}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="flex flex-col h-[100%] !p-0"
                    >
                      {mer?.chokes?.map(
                        (choke, i) =>
                          (
                            <Box
                              className="py-2 !h-[33%]"
                              borderBottom={merBorder(i)}
                            >
                              {choke?.chokeSize}
                            </Box>
                          ) || "-"
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="flex flex-col !p-0"
                      bgcolor={mer?.onProgram ? "#A7EF6F" : "#FF5252"}
                    >
                      <Box className="!h-[100%]">
                        {mer?.onProgram ? "YES" : "NO"}
                      </Box>
                    </TableCell>

                    <TableCell
                      align="center"
                      className="flex flex-col h-[100%] !p-0"
                    >
                      {mer?.chokes?.map(
                        (choke, i) =>
                          (
                            <Box
                              className="py-2 !h-[33%]"
                              borderBottom={merBorder(i)}
                            >
                              {dayjs(choke?.startDate).format(
                                "DD MMM YYYY. hh:mmA"
                              )}
                            </Box>
                          ) || "-"
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="flex flex-col h-[100%] !p-0"
                    >
                      {mer?.chokes?.map(
                        (choke, i) =>
                          (
                            <Box
                              className="py-2 !h-[33%]"
                              borderBottom={merBorder(i)}
                            >
                              {dayjs(choke?.endDate).format(
                                "DD MMM YYYY. hh:mmA"
                              )}
                            </Box>
                          ) || "-"
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="flex flex-col h-[100%] !p-0"
                    >
                      {mer?.chokes?.map(
                        (choke, i) =>
                          (
                            <Box
                              className="py-2 !h-[33%]"
                              borderBottom={merBorder(i)}
                            >
                              {dayjs(choke?.endDate).diff(
                                choke?.startDate,
                                "hours"
                              )}
                            </Box>
                          ) || "-"
                      )}
                    </TableCell>

                    <TableCell colSpan={1} align="center">
                      <textarea
                        className="border outline-none px-2 !h-[100%] py-1"
                        defaultValue={mer?.remark || "No Remark"}
                        onChange={(e) => {
                          setMerSchedule((prev) => ({
                            ...prev,
                            merScheduleData: {
                              ...prev?.merScheduleData,
                              [mer?.productionString]: {
                                ...prev?.merScheduleData?.[
                                  mer?.productionString
                                ],
                                remark: e.target.value,
                              },
                            },
                          }));
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </>
            );
          })}
        </Table>
      </TableContainer>

      {user.permitted.remarkMERschedule && (
        <div className="flex justify-end py-1">
          <Button loading={loading} onClick={save} width={120}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
