const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const nodeCron = require("node-cron");
const axios = require("axios").default;
const cors = require("cors");
var path = require("path");
var ObjectId = require("mongodb").ObjectID;

// ========================
// MiddleWares
// ========================
// Make sure you place body-parser before your CRUD handlers!
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));

app.set("view engine", "ejs");
app.use(cors());

// ========================
// Property Routes
// ========================


//xml data
var fs = require("fs"),
  xml2js = require("xml2js");
let leaseXML = [];
let soldXML = [];

var parser = new xml2js.Parser();

fs.readFile(__dirname + "/ftp/data.xml", function (err, data) {
  parser.parseString(data, function (err, result) {
    //  console.dir(result);
    //  console.log("Done",'xml');
    leaseXML = result;
  });
});

fs.readFile(__dirname + "/ftp/sold.xml", function (err, data) {
  parser.parseString(data, function (err, result) {
    //  console.dir(result);
    //  console.log("Done",'xml');
    let data = result.propertyList.residential.map((i) => {
      if (i.$.status == "sold") {
        soldXML.push(i);
      }
    });
  });
});

app.get("/sale", (req, res) => {
  res.send(sale);
});

app.get("/sold", (req, res) => {
  res.send(sold);
});

app.get("/lease", (req, res) => {
  res.send(leaseXML);
});

app.get("/sold_xml", (req, res) => {
  res.send({ soldXML });
});

app.get("/reviews", (req, res) => {
  res.send({ reviews });
});

 app.get("/inpectionTime", (req, res) => {

   axios({
     method: "get",
     url: `https://ap-southeast-2.api.vaultre.com.au/api/v1.3/openHomes?properties=${req.query.id},0&pagesize=50`,
     headers: {
       Authorization: `Bearer ${token}`,
       "X-Api-Key": key,
     },
   })
     .then((response) => {
       res.send(response.data);
       console.log(req.query.id, "openHomes");
     })
     .catch((error) => {
       console.log(error);
     });
 
 });


app.listen(process.env.PORT || 3100, function () {
  console.log(`listening on ${3100}`);
});

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
    //  Lease Routes
    // ========================

    // ========================
    // Blog Routes
    // ========================

    // let posts = [
    //   {
    //     content:
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ut quam sit amet vehicula. Donec sit amet facilisis quam. Integer mollis, urna accumsan tempor hendrerit, risus neque tincidunt neque, in aliquam elit eros quis tortor. Sed id venenatis massa, ut malesuada sem. Nam lacinia sodales tellus nec efficitur. Vestibulum fringilla nisl ac iaculis ultricies. Sed commodo imperdiet metus vitae molestie. In laoreet rutrum pretium. Aenean a enim ac lacus tincidunt pellentesque ac a tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ut quam sit amet vehicula. Donec sit amet facilisis quam. Integer mollis, urna accumsan tempor hendrerit, risus neque tincidunt neque, in aliquam elit eros quis tortor. Sed id venenatis massa, ut malesuada sem. Nam lacinia sodales tellus nec efficitur. Vestibulum fringilla nisl ac iaculis ultricies.",
    //     img: "https://kollosche-1bfb7.kxcdn.com/wp-content/uploads/2022/08/165777114369571257-rsd.jpeg",
    //     type: "Post",
    //     title: "The Best Suburb for Investors.",
    //   },
    //   {
    //     content:
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ut quam sit amet vehicula. Donec sit amet facilisis quam. Integer mollis, urna accumsan tempor hendrerit, risus neque tincidunt neque, in aliquam elit eros quis tortor. Sed id venenatis massa, ut malesuada sem. Nam lacinia sodales tellus nec efficitur. Vestibulum fringilla nisl ac iaculis ultricies. Sed commodo imperdiet metus vitae molestie. In laoreet rutrum pretium. Aenean a enim ac lacus tincidunt pellentesque ac a tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ut quam sit amet vehicula. Donec sit amet facilisis quam. Integer mollis, urna accumsan tempor hendrerit, risus neque tincidunt neque, in aliquam elit eros quis tortor. Sed id venenatis massa, ut malesuada sem. Nam lacinia sodales tellus nec efficitur. Vestibulum fringilla nisl ac iaculis ultricies.",
    //     img: "https://kollosche-1bfb7.kxcdn.com/wp-content/uploads/2022/07/Feature-Image-scaled.jpg",
    //     type: "Article",
    //     title: "The Gold Coast’s Newest Million Dollar Suburbs.",
    //   },
    // ];

    app.post("/addPost", (req, res) => {
      blogCollection.insertOne(req.body);
      res.send("200");
    });

    app.delete("/removePost", (req, res) => {
      blogCollection.findOneAndDelete({ _id: ObjectId(req.body.id) });
      res.send("200");
    });

    app.get("/getPost", (req, res) => {
      blogCollection
        .find({ _id: ObjectId(req.query.id) })
        .toArray()
        .then((results) => {
          console.log(results);
          res.send(results);
        })
        .catch(/* ... */);
    });

        app.post("/updatePost", (req, res) => {
          console.log('reciveed')
          blogCollection
           .replaceOne(
             {
             _id: ObjectID(req.query.id)
           },
           req.body
           )
            .catch(/* ... */);
                  res.send("200");

        });

    app.get("/posts", (req, res) => {
      blogCollection
        .find()
        .toArray()
        // .sort({_id:-1})
        .then((results) => {
          res.send(results);
        })
        .catch(/* ... */);
    });
  })

  
  // .catch((error) => console.error(error));

// ========================
// Valtre API schedule
// ========================

const token = "ozyttvptsnkpbvjfhogsvrtojytbptqeljwbyhyp";
const key = "wljszq3Wsj8omYXJk6Aek9BdMQCE8ecF7aGmK9hI";
const saleApi =
  // "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale?publishedOnPortals=35646&sort=inserted&pagesize=5000&sortOrder=desc&status=listing";
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale?publishedOnPortals=35646&sort=inserted&sortOrder=desc";
//&status=listingOrConditional";
const soldApi =
    "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale/sold?pagesize=50&sort=unconditional&sortOrder=desc&unconditionalSince=2021-06-24";
  // "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale/sold?sort=unconditional&sortOrder=desc";
 // "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/sale/sold?pagesize=50&sort=unconditional&sortOrder=desc&unconditionalSince=2020-06-24";

const leaseApi =
  "https://ap-southeast-2.api.vaultre.com.au/api/v1.3/properties/residential/lease?sort=modified&sortOrder=desc";

let sale = [];
let sold = [];
let lease = [];
let reviews;


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
      console.log();
    })
    .catch((error) => console.log(error));
};

const requestReviews=()=>{
  var config = {
    method: "get",
    url: "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJWaSVaiRD1moRq7kIpy_WiYQ&fields&fields=name%2Crating%2Cformatted_phone_number&key=AIzaSyCTOE_MsQbccUCzP30zTME94o-vTI6-IaA",
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data), "reviews");
      reviews = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

requestReviews()

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
      lease = {
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

const job = nodeCron.schedule("0 10 * * * *", function jobYouNeedToExecute() {
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
  // console.log(sale);

  requestSalePropertyData(date);
  requestSoldPropertyData(date);
  requestLeasePropertyData(date);
  requestReviews();
  callFTp();
});

// ========================
// FTP Server
// ========================

// Quick start, create an active ftp server.
const ftp = require("basic-ftp");
const { post } = require("request");
const { ObjectID } = require("bson");
// ESM: import * as ftp from "basic-ftp"

async function callFTp() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "ftpupload.net",
      user: "lblog_32324281",
      password: "f6mu6a",
      secure: false,
    });
    // console.log(await client.list('/propertyMe/'));

    let FileArray = await client.list("/propertyMe/")
    // await client.uploadFrom("index.html", "index.html");
    let FileName = FileArray[FileArray.length - 1].name;
    await client.downloadTo(
      "ftp/data.xml",
      `propertyMe/${FileName}`
    );
  } catch (err) {
    console.log(err);
  }
  client.close();
}

callFTp();
