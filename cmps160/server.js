const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('.'));
// app.get('/', (req, res) => {
// })

app.listen(3000, () => {
    console.log('Server Started');
});
