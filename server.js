'use strict';

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

require('dotenv').config();
// const cors = require('cors');
// app.use(cors());
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
app.post('/searches', collectFormInformation);
app.get('/searches/new', renderSearchForm);
app.get('/error');

// app.get('/views', renderSearchForm);
// app.get('searches', collectFormInformation);

// CONSTRUCTOR FUNCTION 

function Book(object) {
    this.title = object.title ? object.title : 'No title found.';
    this.author = object.authors ? object.authors[0] : 'No author found';
    this.description = object.description ? object.description : 'No description found.';
    this.image = object.imageLinks.thumbnail ? object.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
    
}

// FUNCTIONS

function renderHomePage(req, res) {
    // res.sendfile('/views/pages');
    console.log('inside home function');
    res.status(200).render('pages/index.ejs');
}

function renderSearchForm(req, res){
    console.log('inside search file');
    res.status(200).render('pages/searches/new.ejs');
}

function collectFormInformation(req, res) {
       const searchQuery = req.body.search[0];
       const searchType = req.body.search[1];

       let url = 'https://www.googleapis.com/books/v1/volumes?q=';
       if(searchType === 'title') {url += `+intitle:${searchQuery}`}
       if(searchType === 'author') {url += `+inauthor:${searchQuery}`}
    
       superagent.get(url)
       .then (data =>{
           console.log(data.body);
           const bookArray = data.body.items;
           const finalBookArray = bookArray.map(book => new Book(book.volumeInfo));
           res.status(200).render('pages/searches/show', {library: finalBookArray});  
       }) .catch (error =>{
           console.error('This is our error', error);
           res.status(500).render('pages/error');
       });
}



// SERVER IS LISTENING



app.listen(PORT, (req, res) =>{
    console.log('Listening on port', PORT);
});