const express = require('express');
const app = express();
const port = 3000;

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

*/