'use strict';

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
app.use('superagant');
require('dotenv').config();
app.use(cors());
const { response } = require('express');
const dataBaseUrl = process.env.DATABASE_URL;

clientInformation.onLine('error', (err) =>{
    console.error(err); 
})


// BRING IN MY MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// GLOBAL VARIABLES
const PORT = 3000;

// ROUTES
app.get('/', renderHomePage);
app.get('/searchform', renderSearchForm);
app.get('searches', collectFormInformation);

// CONSTRUCTOR FUNCTION 



// FUNCTIONS

function renderHomePage() {
    console.log('Welcome to homepage');
}


app.listen(PORT, (req, res) =>{
    console.log('Listening on port', PORT);
});