import React, { useState } from "react";
import Papa from "papaparse";
import { read, utils } from "xlsx";
function ExcelToCsv({ onComplete = () => null, children }) {
    const [csvData, setCsvData] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const csvData = Papa.unparse(utils.sheet_to_json(sheet), {
                header: true,
            });
            // const newHeader = "Register No, Student Name, Branch, Semester, Course, Exam Type, Attendance, Withheld, IMark, Grade, Result\n";
            // const finalCSVData = newHeader + csvData.substring(csvData.indexOf("\n") + 1)
            setCsvData(csvData);
            onComplete(csvData)
        };
        console.log(reader.readAsArrayBuffer(file),'eee');
    };

    return (
        <div>
            <label htmlFor="excelFile">
                {children}
            </label>
            <input
                type="file"
                id="excelFile"
                hidden
                onChange={handleFileUpload}
            />
            <pre>{csvData}</pre>
        </div>
    );
}
export default ExcelToCsv;