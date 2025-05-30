const cors = require("cors");
const express = require("express");
const initRoutes = require("./src/routes");
const app = express();

global.__basedir = __dirname;

app.use(cors());
/*
app.use( cors({
  origin: 'http://cybergranero.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
*/
//app.options('*', cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//app.use(express.static('assets'))

app.use((err, req, res, next) => {
  const { status = 500, message = 'Error' } = err;
  res.status(status).send(message);
});

try {
  initRoutes(app);
} catch (err) {
  console.error('Error initializing routes:', err.stack);
}

let port = 4600;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
