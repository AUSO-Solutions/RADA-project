import { useEffect, useState } from "react";
import { firebaseFunctions } from "Services";

export const useAssetNames = (options) => {
  const [assetNames, setAssetames] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await firebaseFunctions(
          "getAssetsName",
          { getAll: options?.getAll },
          false,
          { useToken: true }
        );
        setAssetames(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [options?.getAll]);

  return {
    assetNames,
  };
};
