const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'SGITEST',
    server: 'localhost\\MSSQLSERVER16',
    database: 'SGI_DW'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/sqlqry', function (req, res) {
    
    sql.close();
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var sqlreq = new sql.Request();
        sqlreq.query(req.body.q, function (err, recordset) {
            if (err) res.send(err);
            res.send(recordset);
        });
    });

})

app.listen(4605, function () {
  console.log('Listening on port 4605!')
})