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
import { setLoadingScreen } from "Store/slices/loadingScreenSlice";
import { useDispatch } from "react-redux";
import { useMe } from "hooks/useMe";
import Actions from "Partials/Actions/Actions";
import { Query } from "Partials/Actions/Query";
import { Approve } from "Partials/Actions/Approve";
import { createWellTitle } from "utils";
import { openModal } from "Store/slices/modalSlice";

export default function ScheduleTable() {
  const { pathname, search } = useLocation();
  const { user } = useMe();
  const [loading] = React.useState(false);
  const [wellTest, setWellTest] = React.useState({});
  const id = React.useMemo(
    () => new URLSearchParams(search).get("id"),
    [search]
  );
  const { data: res } = useFetch({
    firebaseFunction: "getSetup",
    payload: { setupType: "wellTestSchedule", id },
  });
  React.useEffect(() => {
    setWellTest(res);
  }, [res]);
  const dispatch = useDispatch();
  const save = async () => {
    dispatch(setLoadingScreen({ open: true }));
    try {
      await firebaseFunctions("updateSetup", {
        id,
        setupType: "wellTestSchedule",
        ...wellTest,
      });
      toast.success("Remark saved successfully");
      console.log(res, wellTest);
    } catch (error) {
    } finally {
      dispatch(setLoadingScreen({ open: false }));
    }
  };

  const headerStyle = {
    bgcolor: `rgba(239, 239, 239, 1) !important`,
    color: "black",
    fontWeight: "bold  !important",
  };

  return (
    <div className="px-3 !w-[98%]">
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
                          header={"Query Well Test Schdedule"}
                          id={wellTest?.id}
                          setupType={"wellTestSchedule"}
                          title={createWellTitle(wellTest)}
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
                          header={"Approve Well Test Schdedule"}
                          id={wellTest?.id}
                          setupType={"wellTestSchedule"}
                          pagelink={pathname + search}
                          title={createWellTitle(wellTest)}
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
                colSpan={12}
                sx={headerStyle}
              >
                Well Test Data-{wellTest?.asset}/{wellTest?.field}/Wells
                Schedule/{dayjs(wellTest?.created).format("MMM YYYY")}
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
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Stabilization Duration (Hrs)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Test Duration (Hrs)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                colSpan={3}
                align="center"
                sx={headerStyle}
              >
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(wellTest?.wellsData || {})
              .sort((a, b) =>
                a?.productionString.localeCompare(b?.productionString)
              )
              .sort((a, b) => (b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0))
              ?.map((well, i) => {
                return (
                  <TableRow>
                    <TableCell align="center">{i + 1}</TableCell>
                    <TableCell align="center">{well?.reservoir}</TableCell>
                    <TableCell align="center">
                      {well?.productionString}
                    </TableCell>
                    <TableCell align="center">
                      {well?.chokeSize || "-"}
                    </TableCell>
                    <TableCell
                      bgcolor={well?.isSelected ? "#A7EF6F" : "#FF5252"}
                      align="center"
                    >
                      {well?.isSelected ? "YES" : "NO"}
                    </TableCell>
                    <TableCell align="center">
                      {well?.isSelected
                        ? dayjs(well?.startDate).format("DD MMM YYYY. hh:mmA")
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {well?.isSelected
                        ? dayjs(well?.endDate).format("DD MMM YYYY. hh:mmA")
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {well?.isSelected ? well?.stabilizatonDuration : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {well?.isSelected
                        ? dayjs(well?.endDate).diff(well?.startDate, "hours")
                        : "-"}
                    </TableCell>
                    <TableCell colSpan={3} align="center">
                      <textarea
                        className="border rounded px-2 py-1"
                        defaultValue={well?.remark}
                        onChange={(e) => {
                          setWellTest((prev) => ({
                            ...prev,
                            wellsData: {
                              ...prev?.wellsData,
                              [well?.productionString]: {
                                ...prev?.wellsData?.[well?.productionString],
                                remark: e.target.value,
                              },
                            },
                          }));
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {user.permitted.remarkWellTestSchedule && (
        <div className="flex justify-end py-1">
          <Button loading={loading} onClick={save} width={120}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
