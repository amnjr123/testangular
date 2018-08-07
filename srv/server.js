var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var Connection = require('tedious').Connection;
var config = {
    userName: 'sa',
    password: 'SGITEST',
    server: "localhost",
    options: {
        instanceName: 'MSSQLSERVER16',
        database: 'SGI_DW',
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
};

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


app.post('/sqlqry', function (req, res) {


    var connection = new Connection(config);
    var cb = req.query['callback'];
    var retval = '';

    connection.on('connect', function (err) {
        if (err) {
            console.log("erreur de connexion");
            console.log(err);
            res.send(err);
        } else {
            console.log("SQL Server connected");
            request = new Request(req.body.q, function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                    connection.close();
                    res.send(err);
                } else {
                    try {
                        var rowarray = [];
                        rows.forEach(function (columns) {
                            var rowdata = new Object();
                            columns.forEach(function (column) {
                                rowdata[column.metadata.colName] = column.value;
                            });
                            rowarray.push(rowdata);
                        })
                        connection.close();
                        res.contentType('application/json');
                        retval = JSON.stringify(rowarray);
                        if (cb) {
                            retval = cb + '(' + retval + ');'
                        }
                        res.send(retval);
                        var ip = req.connection.remoteAddress.replace(/^.*:/, '');
                        console.log(rowCount + ' rows sent to: ' + ip);
                    } catch(err) {
                        connection.close();
                        res.send(err);
                        console.log(err);
                    }

                }
            });

            connection.execSql(request);
        }

    });


})

app.listen(4605, function () {
    console.log('Listening on port 4605!')
})