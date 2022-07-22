import "../App.css";
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

function Search(props) {
  const [value, setValue] = React.useState(null);
  const [time, setTime] = React.useState("");

  console.log(props);
  let { setParentData } = props;

  const measurements = [
    "Winds Towers",
    "Lightning",
    "Profiler",
    "Rawinsonde",
    "915-S",
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
    e.preventDefault();

    fetch("/requestdata?days=30&sensor=lightning", {
      method: "GET",
    }).then(async (response) => {
      let data = await response.json();
      setParentData(data);
    });
  }

  return (
    <div className="search-div">
      <p>Retrieve weather data</p>
      <Autocomplete
        className="input-fields"
        id="combo-box-demo"
        label="Source"
        options={measurements}
        onChange={(e) => setValue(e.target.value)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Source" />}
      />
      <Autocomplete
        className="input-fields"
        options={timeOptions.map((option) => option.label)}
        sx={{ width: 300 }}
        onChange={(e) => setTime(e.target.value)}
        renderInput={(params) => <TextField {...params} label="Times" />}
      />
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
