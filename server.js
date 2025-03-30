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
        date = new Date;
    } 
    else if (!isNaN(inputDate)) {
        date = new Date(parseInt(inputDate) * 1000);
    } 
    else {
        date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
        return res.json({ error: "Invalid Date" });
    }

    res.json({
        unix: Math.trunc(date.getTime() / 1000),
        utc: date.toUTCString()
    });
});
    
app.get('/data-atual', (req, res) => {
    const dataAtual = new Date();
    res.json({
        unix: Math.trunc((dataAtual.getTime()) / 1000),
        utc: dataAtual.toUTCString(),
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});