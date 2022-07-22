import React, {useState} from 'react';
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField";

function Upload() {

  const [file, setFile] = useState()
  const [format, setFormat] = useState("")

  const measurements = [
    { label: "Winds Towers", value: "winds_towers" },
    { label: "Lightning", value: "lightning" },
    { label: "Profiler", value: "profiler" },
    { label: "Rawinsonde", value: "rawinsonde" },
    { label: "915-S", value: "915-s"}
  ]; 

  function handleChange(event) {
    setFile(event.target.files[0])
  }
  
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    fetch(`/upload?format=${format}`, {
        method: "POST",
        body: formData
      }).then(async (response) => {
        if (response.ok)
        {
            alert("File has been uploaded!")
        }
        else
        {
            alert("File upload error!")
        }
      });
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <p>Upload data</p>
          <Select
                className="input-fields"
                id="combo-box-demo"
                label="Source"
                onChange={(e) => setFormat(e.target.value)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Source" />}
            >
                {measurements.map((measurement, index) =>
                <MenuItem key={index} value={measurement.value}>{measurement.label}</MenuItem> 
                )}
            </Select>
          <input type="file" onChange={handleChange}/>
          <button type="submit">Upload</button>
        </form>
    </div>
  );
}

export default Upload;