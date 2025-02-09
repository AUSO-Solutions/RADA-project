import React, { useState, useEffect } from "react";
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Button } from "Components";
import { roundUp } from "utils";

const PDFReport = ({ data, date, asset }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  console.log(data);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    ReactPDF.pdf(<PdfDocument data={data} date={date} asset={asset} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleDownloadPDF = () => {
    ReactPDF.pdf(<PdfDocument data={data} date={date} asset={asset} />)
      .toBlob()
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Daily Operations Data_${asset}_${date}`;
        link.click();
      });
  };

  return (
    <div className="relative">
      <div className="flex justify-start pl-4 items-center gap-4">
        <Button onClick={handleDownloadPDF} bgcolor={""} className={"px-3"}>
          Download Report
        </Button>
      </div>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"600px"}
          title="Report Preview"
          style={{ border: "1px solid black", marginTop: "20px" }}
        />
      )}
    </div>
  );
};

export default PDFReport;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    // width: "100%"
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "demibold",
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid black",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    border: "1px solid #000",
    paddingVertical: 1,
    flex: 1,
    textAlign: "left",
    fontSize: 8,
    paddingHorizontal: 4,
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#d9d9d9",
  },
});

const PdfDocument = ({ data, asset, date }) => {
  const summaryData = [
    { name: "Gross (blpd)", value: roundUp(data?.summary?.totalGross) },
    { name: "Net Oil (bopd)", value: roundUp(data?.summary?.totalOil) },
    { name: "BS&W (%)", value: roundUp(data?.summary?.bsw) },
    { name: "Produced Gas (MMscf/d)", value: roundUp(data?.summary?.totalGas) },
    {
      name: "Flared Gas (MMscf/d)",
      value: roundUp(data?.summary?.totalFlaredGas),
    },
    {
      name: "Export Gas (MMscf/d)",
      value: roundUp(data?.summary?.totalExport),
    },
    {
      name: "Utilized Gas (MMscf/d)",
      value: roundUp(data?.summary?.totalUtilisedGas),
    },
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <ReportHeader asset={asset} date={date} />
        <SummaryTable asset={asset} summaryData={summaryData} />
        <FacilitiesTable asset={asset} facilitiesData={data?.facilities} />
        <FacilitiesProduction facilitiesData={data?.sortedProduction} />
      </Page>
    </Document>
  );
};

const ReportHeader = ({ asset, date }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.mainHeader}>
        {`${asset} Production Report - ${date}`}
      </Text>
      <Text style={{ fontSize: 14 }}>
        RADA AMS Daily Production Data Report
      </Text>
    </View>
  );
};

const SummaryTable = ({ asset, summaryData }) => {
  if (summaryData.length === 0) return;
  return (
    <View style={styles.section}>
      <Text style={styles.subHeader}>{`${asset} Production Summary`}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Variables</Text>
          <Text style={styles.tableCell}>Values</Text>
        </View>
        <>
          {summaryData.map((data) => (
            <View key={data.name} style={styles.tableRow}>
              <Text style={styles.tableCell}>{data.name}</Text>
              <Text style={styles.tableCell}>{data.value}</Text>
            </View>
          ))}
        </>
      </View>
    </View>
  );
};

const FacilitiesTable = ({ asset, facilitiesData }) => {
  if (facilitiesData.length === 0) return;
  return (
    <View style={styles.section}>
      <Text style={styles.subHeader}>{`${asset} Production Per Facility`}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}>
            Gross
            {"\n"}
            (blpd)
          </Text>
          <Text style={styles.tableCell}>
            Net
            {"\n"}
            (bopd)
          </Text>
          <Text style={styles.tableCell}>
            Water
            {"\n"}
            (bwpd)
          </Text>
          <Text style={styles.tableCell}>
            BS&W
            {"\n"}
            (%)
          </Text>
          <Text style={styles.tableCell}>
            Produced Gas
            {"\n"}
            (MMscf/d)
          </Text>
          <Text style={styles.tableCell}>
            Utilised Gas
            {"\n"}
            (MMscf/d)
          </Text>
          <Text style={styles.tableCell}>
            Export Gas
            {"\n"}
            (MMscf/d)
          </Text>
          <Text style={styles.tableCell}>
            Flared Gas
            {"\n"}
            (MMscf/d)
          </Text>
        </View>
        <>
          {facilitiesData.map((data) => (
            <View key={data.flowstation} style={styles.tableRow}>
              <Text style={styles.tableCell}>{data.flowstation}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.gross)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.net)}</Text>
              <Text style={styles.tableCell}>
                {roundUp(data?.gross * data?.bsw * 0.01)}
              </Text>
              <Text style={styles.tableCell}>{roundUp(data?.bsw)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.producedGas)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.utilisedGas)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.exportGas)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.flaredGas)}</Text>
            </View>
          ))}
        </>
      </View>
    </View>
  );
};

const FacilitiesProduction = ({ facilitiesData }) => {
  if (facilitiesData.length === 0) return;
  return (
    <>
      <Text style={styles.subHeader}>PRODUCTION PER STRING</Text>
      {Object.entries(facilitiesData).map(([key, value]) => (
        <FacilityProduction
          key={key}
          flowstation={key}
          productionData={value}
        />
      ))}
    </>
  );
};

const FacilityProduction = ({ flowstation, productionData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.subHeader}>{`${flowstation} Production Data`}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}>
            Gross
            {"\n"}
            (blpd)
          </Text>
          <Text style={styles.tableCell}>
            Net
            {"\n"}
            (bopd)
          </Text>
          <Text style={styles.tableCell}>
            Water
            {"\n"}
            (bwpd)
          </Text>
          <Text style={styles.tableCell}>
            BS&W
            {"\n"}
            (%)
          </Text>
          <Text style={styles.tableCell}>
            THP
            {"\n"}
            (psi)
          </Text>
          <Text style={styles.tableCell}>
            Choke Size
            {"\n"}
            (/64)
          </Text>
        </View>
        <>
          {productionData.map((data) => (
            <View key={data.flowstation} style={styles.tableRow}>
              <Text style={styles.tableCell}>{data.productionString}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.gross)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.oil)}</Text>
              <Text style={styles.tableCell}>{roundUp(data?.water)}</Text>
              <Text style={styles.tableCell}>
                {roundUp((data?.water * 100) / (data?.oil + data?.water))}
              </Text>
              <Text style={styles.tableCell}>
                {data?.thp ? roundUp(data?.thp) : ""}
              </Text>
              <Text style={styles.tableCell}>
                {data?.bean ? data?.bean : ""}
              </Text>
            </View>
          ))}
        </>
      </View>
    </View>
  );
};
