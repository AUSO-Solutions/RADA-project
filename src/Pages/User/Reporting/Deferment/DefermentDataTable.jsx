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

// const TableInput = (props) => {
//   return (
//     <input
//       className="p-1 text-center w-[80px] h-[100%] border outline-none "
//       required
//       {...props}
//     />
//   );
// };

const createOpt = (item) => ({ label: item, value: item });
const aggregationFrequency = ["Day", "Month", "Year"];

const DefermentDataTable = ({ assetOptions = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const query = useSelector((state) => state?.setup);
  const setupData = useSelector((state) => state?.setup);
  const { assetNames } = useAssetNames();
  const assets = useAssetByName(setupData?.asset);

  const res = useFetch({
    firebaseFunction: "getDefermentData",
    payload: {
      asset: query?.asset,
      flowStation: query?.flowStation,
      startDate: query?.startDate,
      endDate: query.endDate,
    },
    refetch: query,
  });
  console.log(res);

  // const data = useMemo(() => {
  //   if (res?.data) return JSON.parse(res?.data);
  //   return {};
  // }, [res?.data]);
  // console.log(data);

  // const dailyData = useMemo(() => Object.values(data.dailyData || {}), [data]);
  // const monthlyData = useMemo(
  //   () => Object.values(data.monthlyData || {}),
  //   [data]
  // );
  // const yearlyData = useMemo(
  //   () => Object.values(data.yearlyData || {}),
  //   [data]
  // );
  // console.log({ dailyData, monthlyData, yearlyData });

  useEffect(() => {
    const asset = searchParams.get("asset") || assetNames?.[0];
    const flowstation = searchParams.get("flowstation") || "";
    const frequency = searchParams.get("frequency") || "Day";
    const startDate =
      searchParams.get("startDate") ||
      dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const endDate =
      searchParams.get("endDate") ||
      dayjs().subtract(1, "day").format("YYYY-MM-DD");

    dispatch(setSetupData({ name: "asset", value: asset }));
    dispatch(setSetupData({ name: "flowstation", value: flowstation }));
    dispatch(setSetupData({ name: "frequency", value: frequency }));
    dispatch(setSetupData({ name: "startDate", value: startDate }));
    dispatch(setSetupData({ name: "endDate", value: endDate }));
  }, [dispatch, assetOptions, assetNames, searchParams]);

  return (
    <div className="relative">
      <div className="w-full flex flex-row justify-between px-[32px] mt-2">
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
              options={[{ label: "All", value: "" }].concat(
                assets.flowStations?.map(createOpt)
              )}
              onChange={(e) => {
                setSearchParams((prev) => {
                  prev.set("flowstation", e?.value);
                  return prev;
                });
              }}
            />
          </div>
          {setupData.frequency === "Day" ? (
            <div>
              <input
                type="date"
                name=""
                className="border p-2  rounded-[12px]"
                value={setupData?.startDate}
                onChange={(e) => {
                  setSearchParams((prev) => {
                    prev.set(
                      "startDate",
                      dayjs(e.target.value).format("YYYY-MM-DD")
                    );
                    prev.set(
                      "endDate",
                      dayjs(e.target.value).format("YYYY-MM-DD")
                    );
                    return prev;
                  });
                }}
              />
            </div>
          ) : (
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
          )}

          <div className="flex items-center justify-normal gap-1">
            <div className="text-4">Frequency</div>
            <div className="w-[120px]">
              <Input
                placeholder={"Frequency"}
                required
                type="select"
                options={aggregationFrequency?.map((freq) => ({
                  value: freq,
                  label: freq,
                }))}
                onChange={(e) => {
                  setSearchParams((prev) => {
                    prev.set("frequency", e?.value);
                    return prev;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefermentDataTable;
