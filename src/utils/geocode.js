const request = require('request');

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1Ijoiam9kb21vIiwiYSI6ImNraGNpZXVkejAxNWkyd255emwxdHN6aXoifQ.P8VLTp1glUlbvvMtMuJTGQ';

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Could not connect to the MapBox API servers!', undefined);
        } else if (!address || address.trim().length === 0 || !body.features || body.features.length == 0) {
            callback('Could not find "' + address + '"! Try another search term.', undefined);
        } else {
            const {[0]:data} = body.features;
            const {[0]:latitude, [1]:longitude} = data.center;
            const {place_name:location} = data;
            callback(undefined, {latitude, longitude, location});
        }
    });
};


module.exports = geocode;