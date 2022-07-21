import "../App.css";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";

function Display() {
  return (
    <div className="display-div">
      <TextField
        className="data-textField"
        fullWidth
        disabled
        id="filled-disabled"
        defaultValue="206 Partial Content (RFC 7233)
      The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.[15]
      207 Multi-Status (WebDAV; RFC 4918)
      The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.[16]
      208 Already Reported (WebDAV; RFC 5842)
      The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
      226 IM Used (RFC 3229)
      The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.[17]"
        variant="filled"
        multiline
      />
    </div>
  );
}

export default Display;
