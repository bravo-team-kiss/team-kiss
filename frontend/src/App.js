import "./App.css";
import React from "react";
import Grid from "@mui/material/Grid";
import Search from "./components/Search";
import Display from "./components/Display";

function App() {
  const [data, setData] = React.useState();

  // const setParentData = (data) => {
  //   setData(data);
  // };
  return (
    <div className="App-header">
      <p>Welcome, Team Kiss.</p>
      <Grid container spacing={5} className="grid-container">
        <Grid item xs={6}>
          <Search setParentData={setData} />
        </Grid>
        <Grid item xs={6} className="display-container">
          <Display data={data} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
