import { firebaseFunctions } from "Services";
import { useEffect, useState } from "react";

export const useFetch = ({
  firebaseFunction = "",
  payload = {},
  dontFetch,
  refetch,
  loadingScreen = false,
  useToken = false,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await firebaseFunctions(firebaseFunction, payload, false, {
          loadingScreen,
          useToken,
        });
        setData(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!dontFetch) getData();
    // eslint-disable-next-line
  }, [dontFetch, refetch]);

  return {
    data,
    loading,
  };
};
