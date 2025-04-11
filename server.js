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
    const inputFuso = parseInt(req.query.offset) || 0;
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

    if (inputFuso > 12 || inputFuso < -12){
        return res.json({ error: "Fuso inválido" });
    }
    
    const dataAtualizada = new Date(date.getTime() + inputFuso * 60 * 60 * 1000);

    res.json({
        unix: Math.trunc(dataAtualizada.getTime() / 1000),
        utc: dataAtualizada.toUTCString()
    });
});
    
app.get('/data-atual', (req, res) => {
    const dataAtual = new Date();
    res.json({
        unix: Math.trunc((dataAtual.getTime()) / 1000),
        utc: dataAtual.toUTCString(),
    });
});

app.get('/api/diff/:date1/:date2', (req, res) => {
    const date1Input = req.params.date1;
    const date2Input = req.params.date2;
    let date1;
    let date2;

    if (!isNaN(date1Input)) {
        date1 = new Date(parseInt(date1Input) * 1000);
    } 
    else {
        date1 = new Date(date1Input);
    }

    if (!isNaN(date2Input)) {
        date2 = new Date(parseInt(date2Input) * 1000);
    } 
    else {
        date2 = new Date(date2Input);
    }

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return res.json({ error: "Invalid Date" });
    }

    const difEmMs = Math.abs(date2.getTime() - date1.getTime());
    const difEmDias = Math.floor(difEmMs / (1000 * 60 * 60 * 24));
    const difEmHoras = Math.floor((difEmMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const difEmMin = Math.floor((difEmMs % (1000 * 60 * 60)) / (1000 * 60));
    const difEmSeg = Math.floor((difEmMs % (1000 * 60)) / 1000);

    res.json({
        dias: difEmDias,
        horas: difEmHoras,
        minutos: difEmMin,
        segundos: difEmSeg
    })

})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});