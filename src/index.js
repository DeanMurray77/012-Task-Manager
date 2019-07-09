const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('', (req, res) => {
    res.send("Nothing here, but it's working...");
})

app.post('/users', (req, res) => {
    res.send("testing post users");
})

app.get('/tasks', (req, res) => {
    res.send('Working...');
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})