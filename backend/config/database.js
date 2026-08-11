//const mongoose = require("mongoose");

//const connectDatabase = () => {

//	console.log("DB_URI =", process.env.DB_URI);

  //mongoose
    //.connect(process.env.DB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true,
    //})
    //.then((data) => {
      //console.log(`Mongodb connected with server: ${data.connection.host}`);
    //});
//};

//module.exports = connectDatabase;


const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB connected: ${data.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
