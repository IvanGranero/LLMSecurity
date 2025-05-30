const cors = require("cors");
const express = require("express");
const initRoutes = require("./src/routes");
const app = express();

global.__basedir = __dirname;

app.use(cors());
/*
app.use( cors({
  origin: 'http://localhost:4200'
}));
*/
//app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((err, req, res, next) => {
  const { status = 500, message = 'Error' } = err;
  res.status(status).send(message);
});

initRoutes(app);

let port = 4600;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});