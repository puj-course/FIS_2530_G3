const express = require('express')

const app = express()

const { readFile } = require('fs')

app.get("./", (request, response) => {

    readFile('./home.html', 'utf8', (err, html) => {

        if(err) {
            response.status(500).send('Servidor offline')
        }

        response.send(html)

    })

});


app.listen(3000, () => {
    console.log("listening on http://localhost:3000")
})