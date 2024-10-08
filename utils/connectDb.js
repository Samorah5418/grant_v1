const mongoose = require("mongoose");

const connectDb = (uri) => {
    return mongoose.connect(uri, {
        family: 4
    })
};

module.exports = connectDb;