const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const log = require('fancy-log');

const app = express();

app.use(cors());
dotenv.config()
app.use('/resources', express.static(path.join(__dirname, './resources')))

app.use(express.json());

// routes
app.use('/index', (req, res) => res.sendFile(path.join(__dirname, './resources/index.html')))
app.use('/interactions', (req, res) => res.sendFile(path.join(__dirname, './resources/interactions.txt')))
app.use('/errors', (req, res) => res.sendFile(path.join(__dirname, './resources/errors.txt')))


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  log(err.stack);
  return res.status(err.status || 500).json({
    error: { message: err.message, error: {}},
      status: false,
    });
  }
);

// configure port and listen for requests
const port = parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) || 80;
app.listen(port, () => {
  log(`Server is running on http://localhost:${port} `);
});

module.exports = app;