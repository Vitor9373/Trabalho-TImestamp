let express = require('express');
let app = express();

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Top")
});

app.get('/', function(req,res){
    res.sendFile(__dirname + "/src/index.html");
});


app.get('/:date?', function(req, res){
    console.log(req.params)
    res.send({
        unix: unix,
        utc: utc
    })
});