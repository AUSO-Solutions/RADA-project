import React, { useState, useRef, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import * as pdfjs from "pdfjs-dist";
import { Button } from "Components";

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const MyPDFDocument = ({ data }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Generated PDF Example</Text>
          <Text style={styles.bodyText}>
            Here is some text rendered dynamically!
          </Text>
          {data && <Text style={styles.bodyText}>Dynamic Data: {data}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.bodyText}>
            This is another section of the PDF.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFReport = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const canvasRef = useRef(null);

  const dynamicData = "This is some dynamic content for the PDF.";

  useEffect(() => {
    // Specify the worker source (adjust the path to where pdf.worker.min.js is located)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
  }, []);

  const handleGeneratePDF = async () => {
    const pdfDoc = await pdfjs
      .getDocument(<MyPDFDocument data={dynamicData} />)
      .toBuffer();
    const pdfData = await pdfDoc.save();
    setPdfBytes(pdfData);
  };

  const renderPDFOnCanvas = async (pdfBytes) => {
    try {
      // Load the PDF document from the byte array
      const pdf = await pdfjs.getDocument({ data: pdfBytes }).promise;

      // Get the first page of the document
      const page = await pdf.getPage(1);

      // Get the canvas context and set the viewport of the page rendering
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: 1.5 });

      // Set canvas dimensions to match the page size
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page to the canvas
      await page.render({ canvasContext: context, viewport }).promise;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenderCanvas = () => {
    console.log("Here");
    if (pdfBytes) {
      renderPDFOnCanvas(pdfBytes);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-start pl-4 items-center gap-4">
        <Button onClick={handleGeneratePDF} bgcolor={""} className={"px-3"}>
          Generate Report
        </Button>
        <Button onClick={handleRenderCanvas} bgcolor={""} className={"px-3"}>
          View Report
        </Button>
      </div>

      {pdfBytes && (
        <div>
          <canvas ref={canvasRef}></canvas>
          <PDFDownloadLink
            document={<MyPDFDocument data={dynamicData} />}
            fileName="generated_pdf.pdf"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default PDFReport;
