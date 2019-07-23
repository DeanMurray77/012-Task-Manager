const auth = async (req, res, next) => {
    console.log("Header Info: " + JSON.stringify(req.headers));
    console.log(req.headers.authorization);

    next();
}

module.exports = auth