const express = require('express');
const app = express();
const port = 3000;
const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const token = '_l7EyOTco3SkHzc5JJSI4XC8QMxx5Nf-diWE-he36qHeIb33OGz3hTaor5Tj388tBTQp9B48ta9pfJAyjCFGcg=='
const org = 'test'
const bucket = 'test'
const client = new InfluxDB({url:'http://localhost:8086', token: token})
const writeApi = client.getWriteApi(org, bucket)
const queryApi = client.getQueryApi(org)

function createPoint(measurement, tags, time, fields) {
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

function queryPoints(){
  
}

const query = `from(bucket: "test") |> range(start: -1m)`
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/requestdata', (req, res) => {
  const from_date = req.query.from;
  const to_date = req.query.to;

  res.send({
    'from date': from_date,
    'to date': to_date,
  });
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