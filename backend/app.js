// Includes
const express = require('express');
const fileUpload = require('express-fileupload')
const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const fs = require('fs')
const execSync = require("child_process").execSync

const port = process.env.PORT ?? 1337;

const org = process.env.ORG
const bucket = process.env.BUCKET
const token = process.env.INFLUX_TOKEN

if (!org) {
  console.error('Missing environment variable: ORG');
  process.exit(1);
}
if (!bucket) {
  console.error('Missing environment variable: BUCKET');
  process.exit(1);
}
if (!token) {
  console.error('Missing environment variable: INFLUX_TOKEN');
  process.exit(1);
}
// Express Init
const app = express();
app.use(fileUpload());

// Influx DB init
const client = new InfluxDB({url:'http://influx:8086', token: token})


function createPoint(measurement, tags, time, fields) {
  const writeApi = client.getWriteApi(org, bucket)

  for (i in fields){
    point = new Point(measurement)
    console.log(i)
    for (t in tags){
      point.tag(t, String(tags[t]))
      console.log(t)
      console.log(tags[t])
    }
    point.floatField(i, fields[i])
    console.log(fields[i])

    writeApi.writePoint(point)
    writeApi.close().then(() => {
      console.log('Wrote point')
    }).catch(e => {
      console.error(e)
      console.log('Encountered error')
      console.log(e)
    })
  }
}

function getTags(influxRow) {
  const tags = {};

  const tagKeys =
    Object.keys(influxRow)
      .filter(k => k[0] !== '_')
      .filter(k => !['result', 'table'].includes(k));

  for (const k of tagKeys) {
    tags[k] = influxRow[k];
  }

  return tags;
}

function buildKey(influxRow) {
  const tagValues =
    Object.keys(influxRow)
      .filter(k => k[0] !== '_')
      .filter(k => !['result', 'table'].includes(k))
      .map(k => `${k}=${influxRow[k]}`)
      .join('_');
  return `${influxRow['_measurement']}_${tagValues}`;
}

function createJSON(output) {
  let finalOut = [];
  let current = undefined;
  for (const influxRow of output) {
    let time = influxRow['_time']
    let key = buildKey(influxRow);

    if (current) {
      if (current.key !== key || current.time !== time) {
        finalOut.push(current);
        current = {
          time,
          key,
          values: {},
          tags: getTags(influxRow)
        }
      }
    } else {
      current = {
        time,
        key,
        values: {},
        tags: getTags(influxRow)
      }
    }

    current.values[influxRow['_field']] = influxRow['_value'];
  }

  finalOut.push(current)
  console.log(finalOut)

  return finalOut;
}

app.get('/requestdata', (req, res) => {
  const days = req.query.days;
  const measurement = req.query.sensor;

  if(days && measurement){
    const queryApi = client.getQueryApi(org)

    const query = `from(bucket: "${bucket}") 
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "${measurement}")`

    let o = [];

    queryApi.queryRows(query, {
      next(row, tableMeta){
        let newRow = tableMeta.toObject(row)
        o.push(newRow)
      },
      error(e){
        console.error(e)
        console.log("Query error")
      },
      complete(){
        console.log("Query success")
        if (o[0] === undefined)
        {
          res.status(500).send("Failed display measurements for given time or sensor")
        }
        else{
          res.status(200).send(createJSON(o))
        }
      }
    })
  }
  else{
    res.status(500).send("Days or Sensor Measurement incorrect");
  }
});

app.post('/upload', (req, res) => {
  let sampleFile;
  let uploadPath;
  let tmpDir;
  const tag = req.query.format;

  if(!tag)
  {
    return res.status(400).send("No format set")
  }

  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files uploaded')
  }

  try{
    tmpDir = fs.mkdtempSync("/tmp/")
    sampleFile = req.files.file
    uploadPath = tmpDir + "/" + sampleFile.name

    sampleFile.mv(uploadPath, function(err) {
      if (err){
        return res.status(500).send(err)
      }
      console.log(tmpDir)
      console.log(sampleFile.name)
      const result = execSync(`docker run -v ${tmpDir}/:/tmp/ -e INFLUX_TOKEN registry:8087/${tag} influx /tmp/${sampleFile.name}`)
      console.log(result.toString("utf-8"))

      if(tmpDir+"/"){
        res.send(`${sampleFile.name} successfully uploaded!`)
        fs.rmSync(tmpDir+"/", { recursive : true })
      }
    })
  }
  catch (err){
    console.error(err)
  }
});

app.use(express.static('../frontend/build'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*

For Front end
===============
Drop down: sensor
Drop down: # of days (1, 5, 10, 30, 45...)
Drop down: sample period (x data point per hour)
Drop down: type of data

For back end
===============
1. Detect file *
2. Create file in temp *
3. Run the correct docker image, then remove after completion {Tags: 915-s, lightning, profiler, rawinsonde, winds_towers}
4. Determine if docker did it's job
5. Redirect to /requestdata = Query Influx

*/