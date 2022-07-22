import "../App.css";
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

function Search(props) {
  const [value, setValue] = React.useState("");
  const [time, setTime] = React.useState("");

  console.log(props);
  let { setParentData } = props;

  const measurements = [
    { label: "Winds Towers", value: "winds_towers" },
    { label: "Lightning", value: "lightning" },
    { label: "Profiler", value: "profiler" },
    { label: "Rawinsonde", value: "rawinsonde" },
    { label: "915-S", value: "915-s"}
  ];

  const timeOptions = [
    { label: "Past 1d", value: 1 },
    { label: "Past 3d", value: 3 },
    { label: "Past 7d", value: 7 },
    { label: "Past 14d", value: 14 },
    { label: "Past 60d", value: 60 },
    { label: "Past 1y", value: 365 },
  ];

  function handleClick(e) {
    setParentData()
    
    e.preventDefault();

    fetch(`/requestdata?days=${time}&sensor=${value}`, {
      method: "GET",
    }).then(async (response) => {
      let data = await response.json();
      setParentData(data);
    });
  }

  return (
    <div className="search-div">
      <p>Retrieve weather data</p>
      <Select
        className="input-fields"
        id="combo-box-demo"
        label="Source"
        onChange={(e) => setValue(e.target.value)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Source" />}
      >
        {measurements.map((measurement, index) =>
          <MenuItem key={index} value={measurement.value}>{measurement.label}</MenuItem> 
        )}
      </Select>
      <Select
        className="input-fields"
        sx={{ width: 300 }}
        onChange={(e) => setTime(e.target.value)}
        renderInput={(params) => <TextField {...params} label="Times" />}
      >
        {timeOptions.map((time, index) => 
          <MenuItem key={index} value={time.value}>{time.label}</MenuItem>
        )} 
      </Select>
      <Button
        onClick={(e) => handleClick(e)}
        className="button"
        variant="contained"
        size="large"
        sx={{ background: "#3D5A73" }}
      >
        Download
      </Button>
    </div>
  );
}

export default Search;
