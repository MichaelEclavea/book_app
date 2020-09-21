'use strict';

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

require('dotenv').config();
const cors = require('cors');
app.use(cors());
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));





// BRING IN MY MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// GLOBAL VARIABLES
const PORT = process.env.PORT || 5050;

// ROUTES
app.get('/', renderHomePage);
app.get('/searches/new', renderPages);
// app.get('/views', renderSearchForm);
// app.get('searches', collectFormInformation);

// CONSTRUCTOR FUNCTION 



// FUNCTIONS

function renderHomePage(req, res) {
    // res.sendfile('/views/pages');
    console.log('inside home function');
    res.status(200).render('pages/index.ejs');
}

function renderPages(req, res) {
    res.status(200).render('pages/searches/new.ejs')
}



// SERVER IS LISTENING



app.listen(PORT, (req, res) =>{
    console.log('Listening on port', PORT);
});