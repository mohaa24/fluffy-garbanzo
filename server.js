const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const nodeCron = require("node-cron");
const axios = require("axios").default;
const cors = require("cors");

// ========================
// MiddleWares
// ========================
// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());

// ========================
// Configuring DB
// ========================

let connectionString =
  "mongodb+srv://mohaa24:At2263an@cluster0.xdad1.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("A--Z");
    const saleCollection = db.collection("sale");
    const buyCollection = db.collection("buy");
    const leaseCollection = db.collection("lease");
    const blogCollection = db.collection("blog");

    // ========================
    // Routes
    // ========================
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((quotes) => {
          res.render("index.html");
        })
        .catch(/* ... */);
    });

    // app.post("/sale", (req, res) => {
    //   saleCollection
    //     .insertOne({})
    //     .then((result) => {
    //       console.log(result);
    //     })
    //     .catch((error) => console.error(error));
    // });

    app.get("/sale", (req, res) => {
      db.collection("sale")
        .find()
        .toArray()
        .then((results) => {
          res.send(sale);
        })
        .catch(/* ... */);
    });

        app.get("/sold", (req, res) => {
          db.collection("sale")
            .find()
            .toArray()
            .then((results) => {
              res.send(sold);
            })
            .catch(/* ... */);
        });

    app.listen(process.env.PORT || 3100, function () {
      console.log(`listening on ${3100}`);
    });
  })
  .catch((error) => console.error(error));

// ========================
// Valtre API schedule
// ========================

const token = "ozyttvptsnkpbvjfhogsvrtojytbptqeljwbyhyp";
const key = "wljszq3Wsj8omYXJk6Aek9BdMQCE8ecF7aGmK9hI";
const saleApi =
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale?publishedOnPortals=35646&sort=modified&pagesize=5000&sortOrder=desc";
const soldApi =
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale/sold?sort=modified&pagesize=5000&sortOrder=desc";
const leaseApi =
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/lease?sort=modified&sortOrder=desc";

let sale = [];
let sold = [];
let lease = [];

const requestSalePropertyData = (lastUpdated = "0") => {
  axios({
    method: "get",
    url: saleApi,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Api-Key": key,
    },
  })
    .then((response) => {
      sale = {
        data: response.data,
        lastUpdated: lastUpdated,
      };
    })
    .catch((error) => console.log(error));
};
const requestSoldPropertyData = (lastUpdated = "0") => {
  axios({
    method: "get",
    url: soldApi,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Api-Key": key,
    },
  })
    .then((response) => {
      sold = {
        data: response.data,
        lastUpdated: lastUpdated,
      };
    })
    .catch((error) => console.log(error));
};
const requestLeasePropertyData = (lastUpdated = "0") => {
  axios({
    method: "get",
    url: leaseApi,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Api-Key": key,
    },
  })
    .then((response) => {
      sale = {
        data: response.data,
        lastUpdated: lastUpdated,
      };
    })
    .catch((error) => console.log(error));
};
requestSalePropertyData();
requestSoldPropertyData();
requestLeasePropertyData();

// ========================
// Valtre API schedule
// ========================

const job = nodeCron.schedule("10 * * * * *", function jobYouNeedToExecute() {
  // "* * * * * *"
  //  | | | | | |
  //  | | | | | |
  //  | | | | | day of week
  //  | | | | month
  //  | | | day of month
  //  | | hour
  //  | minute
  //  second(optional)

  let date = new Date().toLocaleString();
  console.log(`Job ran at ${date}`);

 requestSalePropertyData(date);
 requestSoldPropertyData(date);
 requestLeasePropertyData(date);
});
