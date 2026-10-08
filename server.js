const express = require("express");
const mongoose = require("mongoose");
const Assessment = require("./models/Assessment");

const app = express();

const PORT = 5000;


// Allow JSON data
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ewaste")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "E-Waste Intelligence API is running"
    });
});


// Analyze device
app.post("/api/analyze", async (req, res) => {

    const {
        device,
        brand,
        age,
        condition
    } = req.body;


    let scores = {
        repair: 0,
        reuse: 0,
        sell: 0,
        donate: 0,
        recycle: 0
    };


    // Condition scoring
    if (condition === "working") {

        scores.reuse += 40;
        scores.sell += 35;
        scores.donate += 30;
        scores.repair += 5;
        scores.recycle += 5;

    } else if (condition === "minor") {

        scores.repair += 40;
        scores.reuse += 25;
        scores.sell += 20;
        scores.donate += 15;
        scores.recycle += 10;

    } else if (condition === "damaged") {

        scores.repair += 25;
        scores.reuse += 20;
        scores.sell += 10;
        scores.donate += 10;
        scores.recycle += 30;

    } else if (condition === "dead") {

        scores.recycle += 50;
        scores.repair += 10;
        scores.reuse += 5;
        scores.sell += 5;
        scores.donate += 5;
    }


    // Age scoring
    if (age <= 2) {

        scores.reuse += 20;
        scores.sell += 20;
        scores.donate += 15;
        scores.repair += 10;

    } else if (age <= 5) {

        scores.repair += 15;
        scores.reuse += 15;
        scores.sell += 10;
        scores.donate += 10;

    } else {

        scores.recycle += 20;
        scores.repair += 5;
    }


    // Sort options
    const sortedOptions = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);


    const bestOption = sortedOptions[0][0];
    const highestScore = sortedOptions[0][1];

    // Save assessment
    const assessment = new Assessment({
        device,
        brand,
        age,
        condition,
        recommendation: bestOption,
        score: highestScore,
        scores
    });

    await assessment.save();


    // Send result back
    res.json({
        device,
        brand,
        age,
        condition,
        recommendation: bestOption,
        score: highestScore,
        scores
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});