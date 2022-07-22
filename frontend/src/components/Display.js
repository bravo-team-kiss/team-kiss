import "../App.css";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function Display(props) {
  let { data } = props;
  return (
    <div className="display-div">
      <Box className="data-textField">
        <p>{data}</p>
      </Box>
    </div>
  );
}

export default Display;
