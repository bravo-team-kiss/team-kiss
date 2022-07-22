import "./App.css";
import React from "react";
import Grid from "@mui/material/Grid";
import Search from "./components/Search";
import Display from "./components/Display";

function App() {
  return (
    <div className="App-header">
      <p>Welcome, Team Kiss.</p>
      <Grid container spacing={5} className="grid-container">
        <Grid item xs={6}>
          <Search />
        </Grid>
        <Grid item xs={6} className="display-container">
          <Display />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
