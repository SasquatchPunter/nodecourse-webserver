const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const msg1 = document.querySelector('#message1')
const msg2 = document.querySelector('#message2')
const unitButton = document.querySelector('#unitButton')

const uvals = [['m', '\u00B0C'], ['f', '\u00B0F'], ['s', 'K']] // unit value pairs
var uidx = 0 // represents uvals index
unitButton.textContent = uvals[uidx][1]

msg1.textContent, msg2.textContent = ''

unitButton.addEventListener('click', (e) => {
    e.preventDefault()
    unitButton.textContent = uvals[uidx = (uidx + 1) % 3][1]
})

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    msg1.textContent = 'Loading Data...'
    msg2.textContent = ''

    fetch('http://localhost:3000/weather?address=' + location + '&units=' + uvals[uidx][0]).then((res) => {
        res.json().then(({ error, data }) => {
            if (error) {
                msg1.textContent = error
                return console.log('There was an error finding weather data.')
            }
            const { temperature, feelslike, precipitation, pressure, humidity, description, units } = data
            const { name, region, country } = data.location
            const degChar = uvals[uidx][1]

            msg1.textContent = name + ', ' + region + ', ' + country
            msg2.textContent = 'It is ' + temperature + degChar + ' but feels like ' + feelslike + degChar + '.\n' +
                'The weather is currently ' + description + '.'

            console.log('Weather data retrieved and text data finished rendering.')
        })
    })
})