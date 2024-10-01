const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.json({mssg: 'welcome'})
})

app.listen(4000, () => {
    console.log('Listening')
})