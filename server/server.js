var http = require('http');
var url = require('url');
var sql = require('mssql');
var express = require('express');
var qs = require('querystring');


var app = express();

// config for your database
var config = {
    user: 'sa',
    password: 'SGITEST',
    server: 'localhost\\MSSQLSERVER16',
    database: 'SGI_DW'
};

var qry = "with t as "
    + "(Select * from OPENQUERY ("
    + "[SGICUBE],'"
    + "SELECT NON EMPTY {"
    + "[Measures].[Frequentation] "
    + "} ON COLUMNS,"
    + "NON EMPTY { ("
    + "[Arret].[Nom Long].[Nom Long].[CHARB-1],"
    + "[Date].[Annee].[Annee].[2017] ,"
    + "[Date].[Numero Jour].[Numero Jour].ALLMEMBERS,"
    + "[Date].[Jour de la Semaine].[Jour de la Semaine].[Mardi] ,"
    + "[Date].[Mois].[Mois].[Janvier]"
    + ") } ON ROWS "
    + "FROM [CubeSGI]"
    + "'"
    + ")"
    + ")"
    + " Select convert(varchar,[[Date]].[Annee]].[Annee]].[MEMBER_CAPTION]]]) as annee"
    + ",convert(varchar,[[Date]].[Mois]].[Mois]].[MEMBER_CAPTION]]]) as mois"
    + ",convert(varchar,[[Date]].[Numero Jour]].[Numero Jour]].[MEMBER_CAPTION]]]) as numJour"
    + ",convert(varchar,[[Date]].[Jour de la Semaine]].[Jour de la Semaine]].[MEMBER_CAPTION]]]) as jour"
    + ",convert(varchar,[[Arret]].[Nom Long]].[Nom Long]].[MEMBER_CAPTION]]]) as arret"
    + ",convert(int,[[Measures]].[Frequentation]]]) as freq"

    + " from t";



app.get('/test', function (request, response) {

    //Fetch the query

    if (request.method === "POST") {
        var requestBody = '';
        request.on('data', function (data) {
            requestBody += data;
            if (requestBody.length > 1e7) {
                response.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
            }
        });
        request.on('end', function () {

            qry = qs.parse(requestBody);

            sql.close();
            sql.connect(config, function (err) {
                if (err) console.log(err);
                var req = new sql.Req();
                req.query(qry, function (err, recordset) {
                    if (err) response.send(err);
                    response.send(recordset);
                });
            });

        });
    }

});

var server = app.listen(4605, function () {
    console.log('Server is running..');
});