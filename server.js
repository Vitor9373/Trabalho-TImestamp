const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/api/:date?', (req, res) => {
    const inputDate = req.params.date;
    let date;

    if (!inputDate) {
        date = new Date(Date.now());
    } 
    else if (!isNaN(inputDate)) {
        date = new Date(parseInt(inputDate));
    } 
    else {
        date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
        return res.json({ error: "Invalid Date" });
    }

    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});