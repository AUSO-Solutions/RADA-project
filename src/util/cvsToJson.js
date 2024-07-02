import Papa from "papaparse";
// import csvToJson from "convert-csv-to-json"
export default function (csv, filename) {

//var csv is the CSV file with headers
// function csvJSON(csv){
console.log(csv)
    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    //return result; //JavaScript object
    const json  = JSON.stringify(result); 
    console.log(json)
    return JSON.stringify(result); //JSON
//   }
} 

// c6RL6Yp3
// geedigram@gmail.com