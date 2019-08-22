const app = require('./app');

const port = process.env.PORT;

app.get('', (req, res) => {
    res.send("Nothing here, but it's up and working...");
})

app.listen(port, () => {
    console.log("Server is up on port " + port);
})