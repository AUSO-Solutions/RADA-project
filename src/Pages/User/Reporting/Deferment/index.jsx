import { useMemo, useState } from "react";
import DefermentDataTable from "./DefermentDataTable";
import { useAssetByName } from "hooks/useAssetByName";
import { useAssetNames } from "hooks/useAssetNames";
import Header from "Components/header";
import { useSelector } from "react-redux";
import Tab from "Components/tab";

const DefermentReport = () => {
  const setupData = useSelector((state) => state.setup);
  const assets = useAssetByName(setupData?.asset);
  const { assetNames } = useAssetNames();
  const [tab, setTab] = useState(0);
  console.log(assets);

  const assetOptions = useMemo(() => {
    const originalList = assetNames?.map((assetName) => ({
      value: assetName,
      label: assetName,
    }));
    if (assetNames.length === 3)
      return [{ label: "All", value: "" }].concat(originalList);
    return originalList;
  }, [assetNames]);

  const tabs = useMemo(
    () => [
      {
        title: "Multi-variable Report",
        Component: <DefermentDataTable assetOptions={assetOptions} />,
      },
      {
        title: "Chart",
        Component: <DefermentDataTable assetOptions={assetOptions} />,
      },
    ],
    [assetOptions]
  );

  return (
    <div className="h-full">
      <Header name={"Production Deferment Report"} />

      <tabs
        style={{
          display: "flex",
          gap: "40px",
          paddingLeft: "40px",
          borderBottom: "1px solid rgba(230, 230, 230, 1)",
        }}
      >
        {tabs.map((x, i) => (
          <Tab
            key={`${x.title}-${i}`}
            text={x.title}
            active={i === tab}
            onClick={() => setTab(i)}
          />
        ))}
      </tabs>
      {tabs[tab].Component}
    </div>
  );
};

export default DefermentReport;
