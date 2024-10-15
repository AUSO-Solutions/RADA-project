import React, { useId } from "react";
// import Papa from "papaparse";
import { read, utils } from "xlsx";
// import csvToJson from "utils/cvsToJson";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
function ExcelToCsv({ onComplete = () => null, children, className, onSelectFile }) {
    // const [, setCsvData] = useState("");

    // const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    //         toast.error('File must be excel')
    //     }
    //         const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const data = new Uint8Array(e.target.result);
    //         const workbook = read(data, { type: "array" });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         const csvData = Papa.unparse(utils.sheet_to_json(sheet), {
    //             header: true,
    //         });
    //         setCsvData(csvData);
    //         console.log(csvData)
    //         csvToJson(csvData, onComplete)
    //     };
    //     (reader.readAsArrayBuffer(file));
    // };



    // console.log(dayjs("01/01/1970").add(45551,"days"))
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