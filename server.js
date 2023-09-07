const express = require("express");
const jsxEngine = require("jsx-view-engine");
require("dotenv").config();

const connectDB = require("./config/database");
const Flight = require("./models/flight");

const app = express();
const PORT = 3000;

app.set("view engine", "jsx");
app.engine("jsx", jsxEngine());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/flights", async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.render("Index", { allFlights: flights });
  } catch (e) {
    console.log(e);
  }
});

app.get("/flights/new", (req, res) => {
  const flight = new Flight();
  const dt = flight.departs;
  const departsDate = dt.toISOString().slice(0, 16);
  res.render("New", { departsDate });
});


app.post("/flights", async (req, res) => {
  try {
    const createdFlight = await Flight.create(req.body);
    console.log(createdFlight);
    res.redirect("/flights");
  } catch (error) {
    console.log(error);
  }
});

app.get("/flights/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const flight = await Flight.findById(id);
    res.render("Show", {
      flight: flight,
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/flights/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const flightToUpdate = await Flight.findById(id).sort({ destinations: "asc"});
    flightToUpdate.destinations.push(req.body);
    const updatedFlight = await Flight.findByIdAndUpdate(id, flightToUpdate, {
      new: true,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/flights/destination/:id", async (req, res) => {
  const { id } = req.params;
  const flight = await Flight.findById(id);
  res.render("Destination", {
    flight: flight,
  });
});

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});