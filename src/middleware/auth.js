const auth = async (req, res, next) => {
    console.log("async middleware running");

    next();
}

module.exports = auth