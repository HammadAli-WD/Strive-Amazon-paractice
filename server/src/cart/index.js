const express = require("express");
const router = express.Router();


router.get("/", async function (req, res, next) {
    try {

    } catch (error) {

        error.statusCode = 500;
        next(error);
    }
});

router.get("/:id", async function (req, res, next) {
    try {

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
});

router.post("/", async function (req, res, next) {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.put("/:id", async function (req, res, next) {
    try {

    } catch (error) {
        console.log(error);
        error.statusCode = 500;
        next(error);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {

    } catch (error) {
        console.log(error);
        error.statusCode = 500;
        next(error);
    }
});
module.exports = router;