const express = require('express');
const app = express();
const port = 3000;
const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const path = require('path');

const token = 'RfUEWB9Ww_7JaVZ_DYvYo3VPlTBqwQ8I_fpNDcRAn4GAeY-sbrLHOzVrBEKn8P4sQMT-83sObGudnAAriItlug=='
const org = 'test'
const bucket = 'test'
const client = new InfluxDB({url:'http://localhost:8086', token: token})

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

function queryPoints(mins){
  const queryApi = client.getQueryApi(org)
  const query = `from(bucket: "die") |> range(start: -${mins}m)`

  queryApi.queryRows(query, {
    next(row, tableMeta){
      const o = tableMeta.toObject(row)
      console.log(o)
    },
    error(e){
      console.error(error)
      console.log("Loading error")
    },
    complete(){
      console.log("Loading success")
    }
  })
}

/*
const query = `from(bucket: ${bucket}) |> range(start: -1m)`
queryApi.queryRows(query, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)
    console.log(o)
    //console.log(`${o._time} ${o._measurement} on : ${o._field}=${o._value}`)
  },
  error(error) {
    console.error(error)
    console.log('Finished ERROR')
  },
  complete() {
    console.log('Finished SUCCESS')
  },
})
*/

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/sendata.html'));
});

app.get('/requestdata', (req, res) => {
  const minutes = req.query.mins;
  const measurement = req.query.measurement;

  const queryApi = client.getQueryApi(org)

  const query = `from(bucket: "${bucket}") 
  |> range(start: 0)`

  let o = [];

  queryApi.queryRows(query, {
    next(row, tableMeta){
      let newRow = tableMeta.toObject(row)
      console.log(o)
      o.push(newRow)
    },
    error(e){
      console.error(e)
      console.log("Loading error")
    },
    complete(){
      console.log("Loading success")
      res.send(o)
    }
  })
});

app.get('/sendata', (req, res) => {
  const measurement = req.query.measurement;
  const tag1 = req.query.tag1;
  const tag2 = req.query.tag2;
  const time = req.query.time;
  const attr = req.query.attr;
  const value = req.query.value;

  /*
  psuedo

  for every attribute
    create a key + value pair

  for every field
    create a key + value pair
  */

  let tags = {};
  tags[tag1] = tag2;

  console.log(tags);

  let fields = {};
  fields[attr] = value;

  console.log(fields)

  res.send({
    measurement,
    tag1,
    tag2,
    time,
    attr,
    value,
    tags,
    fields
  })
  if(!createPoint(measurement, tags, Date.now(), fields))
  {
    res.send('<h1>Data push failed</h1>');
    res.status(400);
  }
  res.send('<h2>Sent info to database</h2>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/* Data that will most likely be found in sets

Organization
- By Sensor


Order By
- Latitude
- Longitude
- Time
- Date
-Type

1 bucket, measurement = type of sensor, field = attr of sensor

*/