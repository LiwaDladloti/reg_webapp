var express = require('express');
var body_parser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var app = express();

app.use(express.static('public'));
app.use(body_parser.urlencoded({ extended: false}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const mongoURL = process.env.MONGO_DB_URL || "mongodb://reg:reg@ds059306.mlab.com:59306/reg_plates";
mongoose.connect(mongoURL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log('We are connected');
});

var testSchema = mongoose.Schema({
    plate: String
});
var regModel = mongoose.model('regModel', testSchema);

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

app.post('/', function(req, res) {    
    var reg = req.body.regNum;
    var addReg = req.body.submitReg;
    var filter = req.body.filterBtn;
    var town = req.body.area;
    
    if (addReg) {
        storeReg.push(reg);
        res.render('index', {num: storeReg});
    }
    
    var newReg = new regModel ({
        plate: storeReg
    });
    newReg.save(function(err){
        if (err) {
            console.log(err);
        }
    });
    
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