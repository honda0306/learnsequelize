const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.listen(port, () => {
    console.log(`Running on localhost:${port}`);
});
