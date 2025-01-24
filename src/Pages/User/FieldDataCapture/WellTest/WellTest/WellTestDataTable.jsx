import React, { useState, useEffect, useMemo } from "react";
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
import { Button, Input } from "Components";
import { Setting2 } from "iconsax-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useFetch } from "hooks/useFetch";
import dayjs from "dayjs";
import { firebaseFunctions } from "Services";
import { closeModal, openModal } from "Store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  bsw,
  createWellTitle,
  getWellLastTestResult2,
  roundUp,
  sum,
} from "utils";
import Actions from "Partials/Actions/Actions";
import { Query } from "Partials/Actions/Query";
import { Approve } from "Partials/Actions/Approve";
import { setLoadingScreen } from "Store/slices/loadingScreenSlice";
import { useMe } from "hooks/useMe";
import { useGetSetups } from "hooks/useSetups";

const TableInput = (props) => {
  return (
    <input
      className="p-1 text-center w-[80px] h-[100%] border outline-none "
      required
      {...props}
    />
  );
};

const SaveAs = ({ defaultValue, onSave = () => null, loading }) => {
  const [title, setTitle] = useState(defaultValue);
  return (
    <div className="bg-[white] w-[400px]">
      <Text size={24}>Save Well Test Result as</Text>

      <Input
        defaultValue={defaultValue}
        className="w-full"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        loading={loading}
        className="float-right mt-4"
        onClick={() => {
          onSave(title);
        }}
        width={100}
      >
        Save
      </Button>
    </div>
  );
};

export default function WellTestDataTable() {
  // const { search } = useLocation()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useMe();
  const [loading] = useState(false);
  const { pathname, search } = useLocation();
  const [wellTest, setWellTest] = useState({});
  const [wellTestResult, setWellTestResult] = useState({});
  const [searchParams] = useSearchParams();
  const [currFlowstation, setCurrFlowstation] = useState();
  const id = searchParams.get("id");

  // const scheduleId = useMemo(() => new URLSearchParams(search).get('scheduleId'), [search])
  const { data: scheduleData } = useFetch({
    firebaseFunction: "getSetup",
    payload: { setupType: "wellTestSchedule", id },
  });
  const { data: resultData } = useFetch({
    firebaseFunction: "getSetup",
    payload: { setupType: "wellTestResult", id },
  });
  const { setups: wellTestResults } = useGetSetups("wellTestResult");
  const isEdit = useMemo(() => {
    return resultData?.asset ? true : false;
  }, [resultData]);

  useEffect(() => {
    setCurrFlowstation(wellTest?.flowstations?.[0]);
  }, [wellTest?.flowstations]);

  const setupData = useSelector((state) => state?.setup);
  useEffect(() => {
    if (searchParams.get("from-file")) {
      setWellTest({
        asset: setupData?.asset,
        wellTestResultData: setupData?.wellsData,
        month: setupData?.month,
        flowstations: setupData?.flowstations,
      });
      setWellTestResult(setupData?.wellsData);
      // setWellTestResult(isEdit ? resultData?.wellTestResultData : scheduleData?.wellsData);
    } else {
      setWellTest(isEdit ? resultData : scheduleData);
      setWellTestResult(
        isEdit ? resultData?.wellTestResultData : scheduleData?.wellsData
      );
    }
    // eslint-disable-next-line
  }, [resultData, scheduleData, isEdit, searchParams]);

  const save = async (title) => {
    if (!title) {
      toast.info("Please provide a title");
      return;
    }
    dispatch(setLoadingScreen({ open: true }));
    try {
      const arr = Object.values(wellTestResult || {});
      console.log(arr);
      const totals = {
        gross: sum(arr.map((item) => item?.gross || 0)),
        oilRate: sum(arr.map((item) => item?.oilRate || 0)),
        gasRate: sum(arr.map((item) => item?.gasRate || 0)),
        exportGas: null,
        flaredGas: null,
        fuelGas: null,
      };
      const saveScheduleData = {
        asset: wellTest?.asset,
        field: wellTest?.field,
        wellTestScheduleId: wellTest?.id,
        setupType: "wellTestResult",
        wellTestResultData: wellTestResult,
        month: wellTest?.month,
        flowstations: wellTest?.flowstations,
        totals,
      };
      if (isEdit) {
        const payload = { title, ...saveScheduleData, id };
        console.log(payload);
        await firebaseFunctions("updateSetup", payload);
      } else {
        const payload = { title, ...saveScheduleData };
        console.log(payload);
        await firebaseFunctions("createSetup", payload);
        navigate("/users/fdc/well-test-data/");
        // `/users/fdc/well-test-data/well-test-table?id=${res?.?.id}&scheduleId=${res?.?.wellTestScheduleId}`
      }

      dispatch(closeModal());
      toast.success("Data saved to well test result");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingScreen({ open: false }));
    }
  };

  const bringForward = (wellTestResults, asset, productionString) => {
    const data = getWellLastTestResult2(
      wellTestResults,
      asset,
      productionString
    );

    console.log(data);

    setWellTestResult((prev) => {
      return {
        ...prev,
        wellTestResultData: {
          ...prev.wellTestResultData,
          [productionString]: data.productionStringData,
        },
      };
    });
  };

  const fields = [
    { name: "gross", type: "number", fn: () => null, required: true },
    { name: "oilRate", type: "number", fn: () => null, required: true },
    {
      name: "waterRate",
      type: "number",
      fn: (value) => (value.gross || 0) - (value.oilRate || 0),
      disabled: true,
    },
    { name: "gasRate", type: "number", fn: () => null, required: true },
    {
      name: "bsw",
      type: "number",
      fn: (value) => bsw({ gross: value.gross, oil: value.oilRate }),
      disabled: true,
    },
    { name: "gor", type: "number", fn: () => null, required: true },
    { name: "fthp", type: "number", fn: () => null, required: true },
    { name: "flp", type: "number", fn: () => null, required: true },
    { name: "chp", type: "number", fn: () => null, required: false },
    { name: "staticPressure", type: "number", fn: () => null, required: false },
    { name: "orificePlateSize", type: "text", fn: () => null, required: false },
    { name: "sand", type: "number", fn: () => null, required: false },
    { name: "status", type: "text", fn: () => null, required: false },
  ];
  const headerStyle = {
    bgcolor: `rgba(239, 239, 239, 1) !important`,
    color: "black",
    fontWeight: "bold  !important",
  };

  return (
    <form
      className=" w-[80vw] px-3"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(
          openModal({
            component: (
              <SaveAs
                defaultValue={resultData?.title}
                onSave={save}
                loading={loading}
              />
            ),
          })
        );
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center min-w-fit">
          <Link
            to="/users/fdc/well-test-data/"
            className="flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md"
          >
            <ArrowBack />
            <Text>Files</Text>
          </Link>
          <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        <Text display={"block"} className={"w-full"} align={"center"}>
          {" "}
          {createWellTitle(wellTest)}
        </Text>
        <div className="flex justify-end py-2 items-center gap-3">
          <div className="flex gap-2">
            {isEdit &&
              (user.permitted.approveData || user.permitted.queryData) && (
                <Actions
                  actions={[
                    {
                      name: "Query Result",
                      onClick: () =>
                        dispatch(
                          openModal({
                            component: (
                              <Query
                                header={"Query Well Test Data Result"}
                                id={wellTest?.id}
                                setupType={"wellTestResult"}
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
                                header={"Approve Well Test Data Result"}
                                id={wellTest?.id}
                                setupType={"wellTestResult"}
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
          <Input
            type="select"
            placeholder="Flowstation"
            onChange={(e) => setCurrFlowstation(e.value)}
            containerClass={"!w-[250px]"}
            value={{ label: currFlowstation, value: currFlowstation }}
            options={wellTest?.flowstations?.map((flowstation) => ({
              label: flowstation,
              value: flowstation,
            }))}
          />
          <div className="border border-[#00A3FF] px-3 py-1 rounded-md">
            <Setting2 color="#00A3FF" />
          </div>
        </div>
      </div>
      <TableContainer
        className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}
      >
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={2}
                sx={headerStyle}
              >
                Asset
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Choke{" "}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Latest Test Date{" "}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Fluid Type{" "}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Prod. Method
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Gross
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Oil Rate
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Water Rate
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Gas Rate
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                BS&W
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                GOR
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                FTHP
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                FLP
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                CHP
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Static Pressure
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Orifice Plate Size
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Sand
              </TableCell>

              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                colSpan={1}
                sx={headerStyle}
              >
                Status
              </TableCell>
              <TableCell
                style={{ fontWeight: "600", height: "100%" }}
                align="center"
                colSpan={1}
                sx={{
                  bgcolor: `rgba(0, 163, 255, 1) !important`,
                  color: "white",
                  fontWeight: "bold  !important",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                style={{ fontWeight: "600", height: "100%" }}
                align="center"
                colSpan={3}
                sx={headerStyle}
              >
                Remark
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Reservoir{" "}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Production string{" "}
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                Size(/64")
              </TableCell>
              <TableCell align="center" sx={headerStyle}></TableCell>
              <TableCell align="center" sx={headerStyle}></TableCell>
              <TableCell align="center" sx={headerStyle}></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (blpd)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (bopd)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (bwpd)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (MMscf/day)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (%)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Scf/Stb)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Psia)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Psia)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Psia)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Psia)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (Inches)
              </TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              >
                (pptb)
              </TableCell>

              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={{
                  bgcolor: `rgba(0, 163, 255, 1) !important`,
                  color: "white",
                  fontWeight: "bold  !important",
                }}
              ></TableCell>
              <TableCell
                style={{ fontWeight: "600" }}
                align="center"
                sx={headerStyle}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(wellTestResult || {})
              .sort((a, b) => (b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0))
              .filter((well) => well?.flowstation === currFlowstation)
              ?.map((well, i) => {
                const handleChange = (name, value) => {
                  setWellTestResult((prev) => ({
                    ...prev,
                    [well?.productionString]: {
                      ...prev?.[well?.productionString],
                      [name]: value,
                    },
                  }));
                };
                const handleExtraChange = (e) => {
                  const name = e.target.name;
                  const value = e.target.value;
                  handleChange(name, value);
                };
                return (
                  <TableRow key={well?.productionString}>
                    <TableCell align="center">{well?.reservoir}</TableCell>
                    <TableCell align="center">
                      {well?.productionString}
                    </TableCell>
                    <TableCell align="center">{well?.chokeSize}</TableCell>
                    <TableCell align="center">
                      {dayjs(well?.endDate).format("DD/MMM/YYYY")}
                    </TableCell>
                    <TableCell align="center">{well?.fluidType}</TableCell>
                    <TableCell align="center">NF</TableCell>
                    {fields.map((field) => {
                      if (field.name !== "status") {
                        return (
                          <TableCell align="center">
                            <TableInput
                              type={field.type || "number"}
                              required={well.isSelected && field.required}
                              defaultValue={roundUp(
                                field?.fn(well) || well?.[field.name]
                              )}
                              disabled={field?.disabled}
                              onChange={(e) =>
                                handleChange(field.name, e.target.value)
                              }
                            />
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell align="center">
                            <select
                              className={`p-3 outline-none h-full`}
                              onChange={handleExtraChange}
                              name="status"
                              defaultValue={"Accepted"}
                            >
                              <option value=""></option>
                              <option value={"Accepted"}>Accepted</option>
                              <option value={"Rejected"}>Rejected</option>
                            </select>
                          </TableCell>
                        );
                      }
                    })}
                    <TableCell align="center">
                      <Actions
                        actions={[
                          {
                            name: `Forward from ${
                              getWellLastTestResult2(
                                wellTestResults,
                                wellTest.asset,
                                well.productionString
                              )?.wellTestResult?.month || "-"
                            }`,
                            onClick: () =>
                              bringForward(
                                wellTestResults,
                                wellTest.asset,
                                well.productionString
                              ),
                          },
                        ]}
                      ></Actions>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ minWidth: "200px" }}
                      colSpan={3}
                    >
                      <textarea
                        defaultValue={well.remark}
                        onChange={(e) => handleChange("remark", e.target.value)}
                        className="border outline-none p-1"
                        rows={2}
                        cols={20}
                      ></textarea>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {user.permitted.createAndeditWellTestResult && (
        <div className="flex justify-end py-2">
          <Button width={120} type="submit">
            Commit
          </Button>
        </div>
      )}
    </form>
  );
}
