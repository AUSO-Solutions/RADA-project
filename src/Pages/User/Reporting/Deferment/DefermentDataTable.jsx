import React, { useEffect, useMemo } from "react";
import { useFetch } from "hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setSetupData } from "Store/slices/setupSlice";

// const TableInput = (props) => {
//   return (
//     <input
//       className="p-1 text-center w-[80px] h-[100%] border outline-none "
//       required
//       {...props}
//     />
//   );
// };

const DefermentDataTable = ({ assetOptions = [] }) => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state?.setup);

  const res = useFetch({
    firebaseFunction: "fetchDefermentData",
    payload: {
      asset: query?.asset,
      flowStation: query?.flowStation,
      startDate: query?.startDate,
      endDate: query.endDate,
    },
    refetch: query,
  });
  console.log(res);

  const data = useMemo(() => {
    if (res?.data) return JSON.parse(res?.data);
    return {};
  }, [res?.data]);
  console.log(data);

  const dailyData = useMemo(() => Object.values(data.dailyData || {}), [data]);
  const monthlyData = useMemo(
    () => Object.values(data.monthlyData || {}),
    [data]
  );
  const yearlyData = useMemo(
    () => Object.values(data.yearlyData || {}),
    [data]
  );
  console.log({ dailyData, monthlyData, yearlyData });

  useEffect(() => {
    dispatch(setSetupData({ name: "asset", value: assetOptions[0]?.value }));
    dispatch(
      setSetupData({
        name: "startDate",
        value: dayjs().startOf("month").format("YYYY-MM-DD"),
      })
    );
    dispatch(
      setSetupData({
        name: "endDate",
        value: dayjs().endOf("month").format("YYYY-MM-DD"),
      })
    );
  }, [dispatch, assetOptions]);

  return (
    <div>
      <div>Hello All</div>
    </div>
  );
};

export default DefermentDataTable;
