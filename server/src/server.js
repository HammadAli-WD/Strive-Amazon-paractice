const express = require("express")
const {join} = require("path")
const listEndpints = require("express-list-endpoints")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const productRoutes = require("./products");
const reviewRoutes = require("./reviews")

const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./errorHandler")

app.use(cors())

app.use(express.json())
const port = process.env.PORT || 3001
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes)

// ERROR HANDLERS MIDDLEWARES

app.use(badRequestHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)
console.log(listEndpints(app))

mongoose
.connect("mongodb://localhost:27017/strivezon",{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(
    app.listen(port, () =>{
        console.log(`app is runnig on port ${port}`)
    })
)