const path = require('path');
const express = require('express');
const request = require('request');
const hbs = require('hbs');
const { info } = require('console');
const { forecast } = require(path.join(__dirname, '../../weather-app/utils/forecast'));
const geocode = require(path.join(__dirname, '../../weather-app/utils/geocode'));

// Define express config paths
const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../templates/views');
const partialsDir = path.join(__dirname, '../templates/partials');

// Setup express and static directory to serve
const app = express();
const port = process.env.PORT || 3000
app.use(express.static(publicDir));

// Setup handlebars engine and paths
app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerPartials(partialsDir);

// Const template objects
const authName = 'Jeremy Elliott';

// Home Page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Main Page',
        message: 'Find the root page here.',
        authName
    });
});

// About Page 
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        message: 'Find info about me here.',
        info: {
            name: 'Jeremy Elliott',
            location: 'Canmore, Alberta',
            age: '30',
            sex: 'YES',
            catchphrase: '\'Fucking Hell!\''
        },
        authName
    });
});

// Help Page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        message: 'Find help info here.',
        authName
    });
});

// Practice for passing in query strings
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    res.send({
        queryData: req.query
    });
});

// Weather Page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(req.query.units, longitude, latitude, (error, data) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                data,
                location,
                address: req.query.address
            })
        })

    })

});

const html = '<html><body><h1>This Is A Header</h1></body></html>';

app.get('/forecast', (req, res) => {
    // const url = 'http://api.weatherstack.com/current?access_key=6464bfe867a8b90e166764f2f7e759f6&query=Toronto';
    // request({ url: url }, (error, response) => {
    //     if (error) {
    //         res.send('There was an error getting the forecast!');
    //     } else {
    //         res.send(JSON.parse(response.body));
    //     }
    // });
    res.render('weather', {
        title: 'Weather Page',
        authName,
        message: 'Search locations for up-to-the-minute weather data!'
    })

});

app.get('/help/*', (req, res) => {
    res.render('error-404', {
        title: 'Error 404',
        message: 'Help article not found!',
        authName
    });
});

app.get('*', (req, res) => {
    res.render('error-404', {
        title: '404 Error',
        message: 'Page not found!',
        authName
    });
});

app.listen(port, () => {
    console.log(`Port ${port} connected.`);
});