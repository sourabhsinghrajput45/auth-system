const axios = require("axios");

const client = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = client;
