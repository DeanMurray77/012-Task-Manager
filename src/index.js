const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('', (req, res) => {
    res.send("Nothing here, but it's working...");
})

app.get('/tasks', (req, res) => {
    res.send('Working...');
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})