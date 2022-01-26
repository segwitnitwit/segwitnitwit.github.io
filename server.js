const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(path.join(__dirname)))
app.listen(process.env.port || 3003);

console.log('Running at Port 3003');