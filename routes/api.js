/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");

//-- use process.env.DB for final submission
//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(error => {
    console.log("error in connecting to mongodb");
  });

//--define the schema

const schema = mongoose.Schema;

//--test the database
/* const personSchema = new schema({
    name: String});
   const Person = mongoose.model('Person', personSchema);  
   const philip = new Person({name: "Philip June"})
   
  philip.save((err)=>{
    if (err) return (err);
  });
   */

//-------------

const projectSchema = new schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: String },
  updated_on: { type: String },
  assigned_to: { type: String },
  open: { type: Boolean },
  status_text: { type: String }
});

// --Sets the created_on and updated_on parameter equal to the current time
projectSchema.pre("save", function(next) {
  var now = new Date();
  this.updated_on = now.toISOString();
  if (!this.created_on) {
    this.created_on = now.toISOString();
  }
  next();
});

//-- define the data model

const Issue = mongoose.model("Issue", projectSchema);

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      let obj = {};
      obj = req.query;
      obj.project = project;
      //console.log(obj);
      Issue.find(obj)
        .select({ __v: false })
        .exec((err, doc) => {
          if (err) {
            res.send("error in finding data in the project");
          }
          if (doc) {
            res.json(doc);
          }
        });
    })

    .post(function(req, res) {
      var project = req.params.project;

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.send("Missing required fields");
      }

      var newIssue = new Issue({
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text
      });
      newIssue.save((err, result) => {
        if (err) {
          return res.send("error in saving data to Issue database");
        }
        //console.log(result)
        return res.json(result);
      });
    })

    .put(function(req, res) {
      var project = req.params.project;
      //console.log(req.body['_id'],req.body.open)
      console.log(req.body);
      if (!req.body) {
        return res.send("no updated field sent");
      }
      let objUpdate = {};
      objUpdate = req.body;

      Issue.findOneAndUpdate(
        { _id: req.body["_id"] },
        { open: false, updated_on: new Date().toISOString(), objUpdate },
        { new: true },
        (err, doc) => {
          if (err) {
            return res.send(
              "error in findingID and updating in issue database"
            );
          }
          if (doc) {
            //console.log(doc)
            return res.send("successfully updated");
          } else {
            return res.send(`could not update ${doc["_id"]}`);
          }
        }
      );
    })

    .delete(function(req, res) {
      var project = req.params.project;
      Issue.deleteOne({ _id: req.body["_id"] }, (err, doc) => {
        if (err) {
          return res.send("_id error");
        }
        // console.log(doc)
        if (doc) {
          return res.send("deleted " + req.body["_id"]);
        } else {
          return res.send("could not delete" + req.body["_id"]);
        }
      });
    });
};
