var express = require('express');
var body_parser = require('body-parser');
var exphbs = require('express-handlebars');
var app = express();

app.use(express.static('public'));
app.use(body_parser.urlencoded({ extended: false}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(process.env.PORT || 8080, function () {
	console.log('Server running on port 8080');
});

app.get('/', function(req, res) {
    res.render('index');
});

var storeReg = [];
var filteredPlt = [];

function fltPlate(twn, cb) {
    'use strict'
    filteredPlt = [];
    for(let i = 0; i < storeReg.length; i++) {
        let curReg = storeReg[i];
        if (twn === 'cpt' && curReg.startsWith('CA ')) {
            filteredPlt.push(curReg);
        } else if (twn === 'gra' && curReg.startsWith('CEO ')) {
            filteredPlt.push(curReg);
        } else if (twn === 'bel' && curReg.startsWith('CY ')) {
            filteredPlt.push(curReg);
        }
    }
    cb(null, {
        filteredPlt
    });
}

app.post('/reg-number', function(req, res) {    
    var reg = req.body.regNum;
    var addReg = req.body.submitReg;
    var filter = req.body.filterBtn;
    var town = req.body.area;
    
    if (addReg) {
        storeReg.push(reg);
        res.render('index', {num: storeReg});
    }
    
    if (filter) {
//        filteredPlt = [];
        fltPlate(town, function(err, result){
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                res.render('filter', {result: filteredPlt})
            }
        });
    }
});