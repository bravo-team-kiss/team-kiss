import "./App.css";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Search from "./components/Search";
import Display from "./components/Display";

function App() {
  const [value, setValue] = React.useState(null);
  const [time, setTime] = React.useState("");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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

  return (
    <div className="App-header">
      <header>
        <p>Welcome, Team Kiss.</p>
      </header>
      <body className="App-body">
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Search />
          </Grid>
          <Grid item xs={6}>
            <Display />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;
