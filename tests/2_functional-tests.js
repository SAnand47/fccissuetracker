/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
var idTest1, idTest2;

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.project, "test");
          assert.notEqual(res.body.created_on, "");
          assert.notEqual(res.body.updated_on, "");
          assert.equal(res.body.open, true);
          //fill me in too!
          idTest1= res.body['_id']  
                 
        });
      done();
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "check",
          issue_text: "checktext",
          created_by: "Steve"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "check");
          assert.equal(res.body.issue_text, "checktext");
          assert.equal(res.body.created_by, "Steve");
         idTest2= res.body['_id']  
        });
        done();
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "check",
          issue_text: "checktext"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "Missing required fields");
        
        });
        done();
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no updated field sent");
        });
      done();
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: idTest1,
          assigned_to: "Garry"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
        });
      done();
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: idTest2,
          issue_title: "changed",
          assigned_to: "John"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
        });
      done();
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            
          });
        done();
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.forEach(val => {
              assert.property(val, "issue_title");
              assert.property(val, "issue_text");
              assert.property(val, "created_on");
              assert.property(val, "updated_on");
              assert.property(val, "created_by");
              assert.property(val, "assigned_to");
              assert.equal(val.open, true);
              assert.property(val, "status_text");
              assert.property(val, "_id");
            });
           
          });
         done();
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true, created_by: "Jim" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            res.body.forEach(val => {
              assert.property(val, "issue_title");
              assert.property(val, "issue_text");
              assert.property(val, "created_on");
              assert.property(val, "updated_on");
              assert.equal(val.created_by, "Jim");
              assert.property(val, "assigned_to");
              assert.equal(val.open, true);
              assert.property(val, "status_text");
              assert.property(val, "_id");
            });
          });

        done();
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "_id error");
        });
      done();
    });

    test("Valid _id", function(done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .send({ _id: idTest1 })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "deleted"+idTest1);
        });
      done();
    });
  });
});
