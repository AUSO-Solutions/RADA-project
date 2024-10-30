import React, { useId } from "react";
// import Papa from "papaparse";
import { read, utils } from "xlsx";
function ExcelToCsv({ onComplete = () => null, children, className, onSelectFile=()=>null }) {

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            onSelectFile(e.target.files[0])
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = utils.sheet_to_json(worksheet, {
                    raw: false,
                });
                // console.log(json)
                onComplete(json)
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

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
                onChange={readUploadFile}
            />
            {/* <pre>{csvData}</pre> */}
        </div>
    );
}
export default ExcelToCsv;