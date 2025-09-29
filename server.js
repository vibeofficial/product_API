require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 1230;
const app = express();
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express");

app.use(express.json());
app.use(cors());


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Product API Documentation",
      version: '1.0.0',
      description: "Documentation for product api",
      license: {
        name: 'BASE URL: https://product-api-mrbb.onrender.com',
      },
      contact: {
        name: "Backend Repo",
        url: "https://github.com/vibeofficial/product_API.git"
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification));


app.use(productRouter);
app.use(userRouter);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to Database');
  app.listen(PORT, () => {
    console.log('Server on Port:', PORT)
  })
}).catch((error) => {
  console.log('Error connecting Database', error.message)
});