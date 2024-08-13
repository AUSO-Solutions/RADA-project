import Papa from "papaparse";
// import csvToJson from "convert-csv-to-json"
export default function  csvToJson (files, filename, getFile=()=>null) {

    //var csv is the CSV file with headers
    // function csvJSON(csv){
    let jsonData = {}

    if (files) {

        Papa.parse(files, {
            header: true,
            complete: function (results) {
                console.log("Finished:", results.data);
                getFile(results.data)
                jsonData = results.data
            }
        })
    }
    return jsonData
}

// c6RL6Yp3
// geedigram@gmail.com