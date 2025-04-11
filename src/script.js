document.addEventListener('DOMContentLoaded', () => { // Aguarda o carregamento completo do DOM antes de executar o código
    const input = document.getElementById('valorDig');
    const button = document.getElementById('converte'); 
    const unixResult = document.getElementById('unixResult'); 
    const utcResult = document.getElementById('utcResult');
    const unixAtual = document.getElementById('unixAtual');
    const utcAtual = document.getElementById('utcAtual'); // Pega os elementos do html
    const fuso = document.getElementById('fuso');
    const data1Input = document.getElementById('data1');
    const data2Input = document.getElementById('data2');
    const diferencaButton = document.getElementById('diferenca');
    const difResult = document.getElementById('difResult');
  
    async function convertDate() { // Função para converter uma data fornecida pelo usuário
        unixResult.textContent = ''; // Limpa o resultado Unix anterior
        utcResult.textContent = ''; // Limpa o resultado UTC anterior

        const userInput = input.value.trim(); // Obtém e remove espaços extras do valor digitado pelo usuário
        const userFuso = fuso.value.trim(); //Obtém e remove espaços extras do fuso horário fornecido

        try {
            let url = `/api/${userInput}`; // Monta a URL da Api com a data fornecida pelo usuário
            if (userFuso) {
                url += `?offset=${userFuso}`; // Adiciona o parâmetro de fuso horário à URL, se fornecido
            }

            const response = await fetch(url) // Faz a requisição à Api
            const data = await response.json(); //Obtém os dados retornados pela Api

            if (data.error) {
                unixResult.textContent = data.error; // Exibe mensagem de erro, se houver
            } 
            else {
                unixResult.textContent = `Unix: ${data.unix}`; // Exibe a data em Unix retornado pela Api
                utcResult.textContent = `UTC: ${data.utc}`; // Exibe a data em UTC retornada pela Api
            }
        } 
        catch (error) {
            unixResult.textContent = 'Erro';   // Mensagem de erro em caso de falha na requisição
            utcResult.textContent = 'Erro';
        }
    }   

    async function dataAtual() { // Função para buscar e exibir a data atual em Unix e UTC
        try {
            const response = await fetch('/data-atual'); // Faz a requisição à rota que retorna a data atual
            const data = await response.json(); // Obtém os dados retornados pela Api

            unixAtual.textContent = data.unix; // Exibe a data Unix atual
            utcAtual.textContent = data.utc; // Exibe a data UTC atual
        } 
        catch (error) {
            unixAtual.textContent = 'Erro ao buscar data atual'; // Mensagem de erro em caso de falha na requisição
            utcAtual.textContent = 'Erro ao buscar data atual';
        }
    }

    async function calcularDiferenca() {   // Função para calcular a diferença entre duas datas fornecidas pelo usuário
        difResult.textContent = ''; // Limpa o resultado anterior

        const userInputDate1 = data1Input.value.trim(); // Obtém e remove espaços extras da primeira data fornecida pelo usuário
        const userInputDate2 = data2Input.value.trim(); // Obtém e remove espaços extras da segunda data fornecida pelo usuário

        try {
            const url = `/api/diff/${userInputDate1}/${userInputDate2}`; // Monta a URL da Api com as duas datas fornecidas pelo usuário
            const response = await fetch(url); // Faz a requisição à Api
            const data = await response.json(); // Obtém os dados retornados pela Api

            if (data.error) {
                difResult.textContent = data.error;  // Exibe mensagem de erro, se houver
            } 
            else {
                difResult.textContent = `Diferença: ${data.dias} dia(s), ${data.horas} hora(s), ${data.minutos} minuto(s) e ${data.segundos} segundo(s)`;
                // Exibe a diferença calculada entre as duas datas em dias, horas, minutos e segundos
            }
        } 
        catch (error) {
            difResult.textContent = 'Erro ao calcular diferença';  // Mensagem de erro em caso de falha na requisição
        }
    }

    //Adiciona eventos aos elementos para o usuário conseguir interagir com a interface

    button.addEventListener('click', convertDate);

    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            convertDate();
        }
    });

    fuso.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            convertDate();
        }
    });

    diferencaButton.addEventListener('click', calcularDiferenca);

    data1Input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            calcularDiferenca();
        }
    });
    data2Input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            calcularDiferenca();
        }
    });

    dataAtual(); //Chama a função da data atual ao carregar a página

    setInterval(dataAtual, 1000); //Atualiza a cada segundo a data atual
    
  })