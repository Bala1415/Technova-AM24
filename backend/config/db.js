const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://username:username@cluster22.y1gvx.mongodb.net/pathnexus"
    );
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
