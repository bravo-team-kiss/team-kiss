import "./App.css";
import React from "react";
import Grid from "@mui/material/Grid";
import Search from "./components/Search";
import Display from "./components/Display";
import { withStyles } from "material-ui/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

function App() {
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
