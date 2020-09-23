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
app.use(express.urlencoded({
    extended: true
}));


// GLOBAL VARIABLES
const PORT = process.env.PORT || 5050;

// ROUTES
app.get('/', renderHomePage);
app.post('/searches', collectFormInformation);
app.get('/searches/new', renderSearchForm);
app.get('/book/:book.id', getOneBook);
app.get('/error');

// app.get('/views', renderSearchForm);
// app.get('searches', collectFormInformation);

// CONSTRUCTOR FUNCTION 

function Book(object) {
    this.id = object.id ? object.id : 0; 
    this.title = object.title ? object.title : 'No title found.';
    this.author = object.authors ? object.authors[0] : 'No author found';
    this.description = object.description ? object.description : 'No description found.';
    this.image = object.imageLinks.thumbnail ? object.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
    this.isbn = object.industryIdentifiers.identifier ? object.industryIdentifiers.identifier : 'No ISBN found.'; 

}

// FUNCTIONS

function renderHomePage(req, res) {
    const sql = 'SELECT * FROM library';
    client.query(sql)
        .then(results => {
            const allBooks = results.rows;
            res.status(200).render('pages/index.ejs', {
                getBookList: allBooks
            });
        })

}

function renderSearchForm(req, res) {
    console.log('inside search file');
    res.status(200).render('pages/searches/new.ejs');
}

function collectFormInformation(req, res) {
    // const sql = 'INSERT INTO library (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING id;';
    // const safeValues = [author, title, isbn, image_url, description];
    console.log(req.body);
    let sql='';
    if(req.body.search[1] === 'title'){
        sql = 'SELECT * FROM library WHERE title=$1;';
    } else{
        sql = 'SELECT * FROM library WHERE author=$1;';
    }
    const safeValues = [req.body.search[0]];
    console.log(safeValues);
    client.query(sql, safeValues)
        .then(results => {
            console.log(results);
            if (results.rowCount > 0) {
                console.log('in if statemnet');
                const id = results.rows[0].id;
                console.log('results from sql', id)
                response.redirect(`/book/${id}`);
            } else {
                console.log('in else statement');
                const searchQuery = req.body.search[0];
                const searchType = req.body.search[1];

                let url = 'https://www.googleapis.com/books/v1/volumes?q=';
                if (searchType === 'title') {
                    url += `+intitle:${searchQuery}`
                }
                if (searchType === 'author') {
                    url += `+inauthor:${searchQuery}`
                }

                superagent.get(url)
                    .then(data => {

                            // NO INSERT STATEMENT . JUST NEED TO RETURN API CALL
                            // THE BOOKS THAT ARE SHOWN TO USER, GIVE OPTION TO SELECT TO SAVE
                            // WHEN BUTTON SEE DETAILS ROUTE TO NEW PAGE DISPLAY 
                            // THEN GIVE AN ADD BUTTON TO SAVE BOOK 
                            // THEN ROUTE BACK TO SEARCH NEW PAGE


                        // const newBook = new Book(object);
                        // const sql = `INSERT INTO library (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;
                        // const safeValues = [author, title, isbn, image_url, description];
                        // client.query(sql, safeValues)
                        const bookArray = data.body.items;
                        
                        const finalBookArray = bookArray.map(book => new Book(book.volumeInfo));
                        // console.log(finalBookArray);
                        res.status(200).render('pages/searches/show', {
                            library: finalBookArray
                        });
                    }).catch(error => {
                        console.error('This is our error', error);
                        res.status(500).render('pages/error');
                    });

            }
        })

}



function getOneBook(request, response) {
    const id = request.params.book_id;
    console.log(id);
    const sql = 'SELECT * FROM library WHERE id=$1';
    const safeValues = [id];
    client.query(sql)
    .then (results=>{
        const myChosenBook = results.rows[0];
    })  
}


// SERVER IS LISTENING


client.connect()
.then(() => {
    app.listen(PORT, (req, res) => {
        console.log('Listening on port', PORT);
    });
});