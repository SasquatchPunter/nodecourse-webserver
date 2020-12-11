const request = require('request');
const geocode = require('./geocode');
const chalk = require('chalk');

//const host = 'http://api.weatherstack.com/current';
//const ak = 'access_key=6464bfe867a8b90e166764f2f7e759f6';
//const loc = '';
//const units = 'm'; // m for metric
//let temp = '';
//let lat = 43.999660;
//let lon = -79.467560;
//
//let url = host + '?' + ak + '&units=' + units;;
//if(loc.trim().length===0) {
//    url += '&query=' + lat + ',' + lon;
//} else {
//    url += '&query=' + loc;
//}
//
//// set the units symbol
//if(units==='m') temp = 'C';
//else if(units==='s') temp = 'K';
//else temp = 'F';
//
//const callback = (error, response) => {
//    if(error) {
//        console.log(chalk.red('Failed to connect.'));
//    } else if(response.body.error) {
//        console.log(chalk.red(response.body.error.info));
//    }
//    else {
//        const current = response.body.current;
//        const location = response.body.location;
//        console.log(chalk`In ${chalk.inverse(location.name)}, the temperature is currently ${chalk.inverse(current.temperature + temp)} and it is ${chalk.inverse(current.weather_descriptions[0])}.`);
//    }
//};
//
//request({ url: url, json: true, encoding: null }, callback);

const forecast = (units = 's', lon, lat, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=6464bfe867a8b90e166764f2f7e759f6&units=' + units + '&query=' + lon + ',' + lat;

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('There was a problem connecting to the Weatherstack API!', undefined);
        } else if (!['m', 'f', 's'].includes(units)) {
            callback('Selected units are not valid!', undefined);
        } else if (!response.body.location) {
            callback('Could not find a location matching ' + lon + ', ' + lat, undefined);
        } else {
            const { name, region, country } = response.body.location;
            const { temperature, feelslike, precip: precipitation, pressure, humidity, wind_speed, wind_degree } = response.body.current;
            const { [0]: description } = response.body.current.weather_descriptions;

            let u = 'K';
            if (units === 'm')
                u = 'C';
            else if (units === 'f')
                u = 'F';

            const data = {
                location: {
                    name, region, country
                },
                temperature, feelslike, precipitation, pressure, humidity, description, units: u, wind_speed, wind_degree
            };
            callback(undefined, data);
        }
    });
};

const fullForecast = (units, location, callback) => {
    geocode(location, (error, response) => {
        if (error) {
            console.log(chalk.red(error));
        } else {
            forecast(units, response.longitude, response.latitude, (error, data) => {
                if (error) {
                    console.log(chalk.red(error));
                } else {
                    callback(data);
                }
            });
        }
    });
};

exports.forecast = forecast;
exports.fullForecast = fullForecast;