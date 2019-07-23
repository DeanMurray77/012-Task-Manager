const demo = async (req, res, next) => {
    console.log("second middleware function up and running");
    next();
}

module.exports = demo;