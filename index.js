const express = require('express')
var MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 8080
var  url ="mongodb://localhost:27017";
var transactionId = [];  
app.get('/admin/transactions', (req, res) => {
   MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Transaction");
    var type = req.query.type;
    var status = req.query.status;
    var currency = req.query.currency;
    var where = {
      status:status,
    }
    dbo.collection("completed_transactions").find().toArray(function (err, result) {
      if (err) throw err;
      result.map((d, k) => {
        transactionId.push(d.transaction_id);
    })
    });
    if(status == 'pending'){
      dbo.collection("pending_transactions").find({transaction_id: {$nin: transactionId }}).toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
        db.close();
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})