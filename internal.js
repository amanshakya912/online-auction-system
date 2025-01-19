const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

module.exports = {
  express,
  cors,
  mongoose,
  dotenv,
  http,
  socketIo,
  productRoutes: require('./routes/productRoutes'),
  userRoutes: require('./routes/userRoutes'),
  productDetailRoutes: require('./routes/productDetailRoutes')
};
