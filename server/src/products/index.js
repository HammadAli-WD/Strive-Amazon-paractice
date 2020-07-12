const express = require("express")
const { request, response } = require("express")
const productRouter = express.Router()
const q2m = require("query-to-mongo")
const ProductModel = require("../models/ProductModel")
const { writeFile } = require("fs-extra")
const multer = require("multer")
const upload = multer({})
const { join } = require("path")

const imgFolderPath = join(__dirname, "../images/")
productRouter.get("/", async(req, res, next) =>{
try {
    const {query} = req
    const page = query.page
    //delete query.page
    const queryToMongo = q2m(query)
    const criteria = queryToMongo.criteria
    for (let key in criteria) {
        if (typeof criteria[key] !== "object") {
            criteria[key] = { $regex: `${criteria[key]}`, $options: "i"}
        }
    }    
    console.log(criteria)
    //Please also add the review route to the server otherwise populate not works
    //as the route for the product added to the server
    const products = await ProductModel.find(criteria)
     .populate("reviews")/* .exec((err, rev)=>{
         if(err)
         res.send(err)
         else
         res.status(200).json(rev)
     }) */
     .skip(10 * page)
     .limit(10)
    const numOfProducts = await ProductModel.count(criteria);
    
    res.status(200).send({
        data: products,
        currentPage : page,
        pages: Math.ceil(numOfProducts/10),
        results : numOfProducts
    })
        
} catch (e) {
    e.httpRequestStatusCode = 404
    next(e)
    
}
})
productRouter.get("/:id", async(req, res, next) =>{
    try {
        const product = await ProductModel.findById(req.params.id)
        res.status(200).send(product)
    } catch (e) {
        e.httpRequestStatusCode = 500
        next(e)
    }
})
productRouter.post("/", async(req, res, next) => {
try {
    const resp = await new ProductModel({
        ...req.body,
        price: parseInt(req.body.price)
    })
    const { _id } = await resp.save();
    res.send(_id)
} catch (e) {
    console.log(e);
    e.httpRequestStatusCode = 500;
    next(e);
}
})
productRouter.put("/:id", async(req, res, next) => {
    try {
        const { id } = req.params
        console.log(req.body)
        const resp = await ProductModel.findByIdAndUpdate(id, req.body);
        res.status(200).send('Updated')
    } catch (e) {
        e.httpRequestStatusCode = 500;
        next(e)
    }
})
productRouter.delete("/:id", async (req, res, next) =>{
    try {
        const { id } = req.params
        const resp = await ProductModel.findByIdAndDelete(id);
        res.status(200).send('deleted')
    } catch (e) {
        e.httpRequestStatusCode = 500;
        next(e);
    }
})

//for upload (multiple)
productRouter.post("/:id/upload", upload.array("avatar"), async(req, res, next)=>{
    try {
        const arrayOfPromises = req.files.map((file) =>
        writeFile(join(imgFolderPath, file.originalname), file.buffer)
      )
      await Promise.all(arrayOfPromises)
        res.send(200).send("uploaded")
    } catch (e) {
        
    }
})

module.exports = productRouter
