const express = require("express");
const cors = require("cors")
const app = express();
const port = 4000;
const xlsx = require("xlsx");
require('dotenv').config();
console.log("NGROK_URL:", process.env.NGROK_URL);
app.use(cors());  

// const excelFile = xlsx.readFile("employees.xlsx");
// const sheet = excelFile.SheetNames[0];
// const sheetname = excelFile.Sheets[sheet];
// const jsonData = xlsx.utils.sheet_to_json(sheetname);


// app.get('/columns', (req, res) => {
//   const jsonData = xlsx.utils.sheet_to_json(sheetname, { header: 1 });
//   const columnNames = jsonData[0];
//   res.json(columnNames);
// });

let jsonData = null;

let table = 'dynamic_table'
async function fetchData() {
  try {
    const response = await fetch(`${process.env.NGROK_URL}/api/mysql/data/${table}`);
    //dynamic table add as attribute


    
    // Store the data as JSON in jsonData
     jsonData =await response.json();

    // Log the data for verification
    console.log('Data fetched and stored:', jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


// Fetch the data when the app starts (or at any desired point)
fetchData();





app.get('/columns', async(req, res) => {
  const jsonData = await fetch(`${process.env.NGROK_URL}/api/mysql/headers/dynamic_table`)
  const columnNames = await jsonData.json()
  res.json(columnNames);
});



app.get('/tables',async(req,res)=>{
  const jsonData = await fetch(`${process.env.NGROK_URL}/api/mysql/tables`)
  const tablename = await jsonData.json()
  res.json(tablename)
})


app.get('/data1', (req, res) => {
  const columnName = req.query.column; // Get column name from query params

  if (!columnName) {
    return res.status(400).json({ error: 'Column name is required' });
  }

  // Filter data for the specified column
  const data = jsonData.map(row => row[columnName]).filter(value => value !== undefined);

  if (data.length === 0) {
    return res.status(404).json({ error: `No data found for column: ${columnName}` });
  }

  res.json(data); // Return the filtered data for the requested column
});

app.get('/column-metadata', (req, res) => {
  const column = req.query.column;
  
  // Assume you have a mapping of column names to data types
  const columnDataTypes = {
    'id': 'number',
    'EEID': 'string',
    'Full_Name': 'string',
    'Department': 'string',
    'Country' : 'string',
    'Bonus %' : 'float',
    'Annual-Salary' : 'number',
    'Age' : 'number',
    'Ethnicity' : 'string',
    'Gender' : 'string',
    'Business-Unit' : 'string',
    'Hire-Date' : 'string',
    'Exit-Date' : 'string',
    'City' : 'string',

    // Add more columns here
  };
  
  const columnType = columnDataTypes[column] || 'unknown';
  
  res.json({ type: columnType });
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
});

