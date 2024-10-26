const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./index");

mongoose.connect(process.env.DATABASE_LOCAL).catch((err) => console.log(err));

const port = 3000;

const server=app.listen(port, () => {
  console.log("rah oftad");
});


process.on('rejectionHandled',()=>{
server.close(()=>{
  process.exit(1)
})
})