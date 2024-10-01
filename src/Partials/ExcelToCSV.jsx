import React, { useId, useState } from "react";
import Papa from "papaparse";
import { read, utils } from "xlsx";
import csvToJson from "utils/cvsToJson";
import { toast } from "react-toastify";
function ExcelToCsv({ onComplete = () => null, children, className }) {
    const [, setCsvData] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            toast.error('File must be excel')
        }
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
            // console.log(csvData)
            csvToJson(csvData, onComplete)
        };
        (reader.readAsArrayBuffer(file));
    };
    const id = useId()
    return (
        <div className={className} >
            <label htmlFor={id}>
                {children}
            </label>
            <input
                type="file"
                id={id}
                hidden
                onChange={handleFileUpload}
            />
            {/* <pre>{csvData}</pre> */}
        </div>
    );
}
export default ExcelToCsv;