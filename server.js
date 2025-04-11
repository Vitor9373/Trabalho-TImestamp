const express = require('express'); // Importa as bibliotecas necessárias
const app = express();

const path = require('path'); // Cria uma instância do servidor Express e define a porta do servidor
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src'))); // Configura a pasta estática onde os arquivos HTML, CSS e JS estão localizados

app.get('/', (req, res) => { // Rota principal que serve o arquivo HTML inicial ao usuário
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/api/:date?', (req, res) => { // Rota que converte uma data fornecida pelo usuário em Unix e UTC, considerando um possível fuso horário
    const inputDate = req.params.date; // Data fornecida como parâmetro na URL
    const inputFuso = parseInt(req.query.offset) || 0; // Fuso horário fornecido como parâmetro na URL ou padrão 0
    let date;

    if (!inputDate) { // Caso nenhuma data seja fornecida, utiliza a data atual como padrão.
        date = new Date;
    } 
    else if (!isNaN(inputDate)) { // Caso seja uma data em Unix válido.
        date = new Date(parseInt(inputDate) * 1000);
    } 
    else { // Caso seja uma string representando uma data, no caso em UTC.
        date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) { // Caso a data seja inválida.
        return res.json({ error: "Invalid Date" });
    }

    if (inputFuso > 12 || inputFuso < -12){ // Verifica se o fuso horário está nos limites permitidos.
        return res.json({ error: "Fuso inválido" });
    }
    
    const dataAtualizada = new Date(date.getTime() + inputFuso * 60 * 60 * 1000); // Ajusta a hora conforme o fuso horário.

    res.json({
        unix: Math.trunc(dataAtualizada.getTime() / 1000), // Retorna a data Unix ajustada.
        utc: dataAtualizada.toUTCString() // Retorna a string UTC ajustada.
    });
});
    
app.get('/data-atual', (req, res) => { // Rota que retorna a data atual em Unix e UTC.
    const dataAtual = new Date();
    res.json({
        unix: Math.trunc((dataAtual.getTime()) / 1000),
        utc: dataAtual.toUTCString(),
    });
});

app.get('/api/diff/:date1/:date2', (req, res) => { // Rota que calcula a diferença entre duas datas fornecidas pelo usuário.
    const date1Input = req.params.date1;
    const date2Input = req.params.date2;
    let date1;
    let date2;

    //Mesma lógica utilizada para converter datas, mas para conseguir calcular a diferença delas agora
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

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) { // Verifica se alguma das datas é inválida.
        return res.json({ error: "Invalid Date" });
    }

    const difEmMs = Math.abs(date2.getTime() - date1.getTime()); // Calcula a diferença em milissegundos.
    const difEmDias = Math.floor(difEmMs / (1000 * 60 * 60 * 24)); // Converte milissegundos em dias.
    const difEmHoras = Math.floor((difEmMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Converte milissegundos restantes em horas.
    const difEmMin = Math.floor((difEmMs % (1000 * 60 * 60)) / (1000 * 60)); //Converte milissegundos restantes em minutos.
    const difEmSeg = Math.floor((difEmMs % (1000 * 60)) / 1000); // Converte milissegundos restantes em segundos.

    res.json({ // Retorna a diferença das datas, em dias, horas, minutos e segundos.
        dias: difEmDias,
        horas: difEmHoras,
        minutos: difEmMin,
        segundos: difEmSeg
    })

})

app.listen(port, () => { // Inicia o servidor na porta especificada.
    console.log(`Servidor rodando em http://localhost:${port}`);
});