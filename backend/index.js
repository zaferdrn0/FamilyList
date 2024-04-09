const express = require('express')
const app = express()
const port = 4000

app.get('/api/test', (req, res) => {
    const data = {
        data:"hello world"
    }
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})