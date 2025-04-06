document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('valorDig');
    const button = document.getElementById('converte'); 
    const unixResult = document.getElementById('unixResult'); 
    const utcResult = document.getElementById('utcResult');
    const unixAtual = document.getElementById('unixAtual');
    const utcAtual = document.getElementById('utcAtual');
    const fuso = document.getElementById('fuso');
    const data1Input = document.getElementById('data1');
    const data2Input = document.getElementById('data2');
    const diferencaButton = document.getElementById('diferenca');
    const difResult = document.getElementById('difResult');
  
    async function convertDate() {
        unixResult.textContent = '';
        utcResult.textContent = '';
        const userInput = input.value.trim();
        const userFuso = fuso.value.trim();

        try {
            let url = `/api/${userInput}`;
            if (userFuso) {
                url += `?offset=${userFuso}`;
            }

            const response = await fetch(url)
            const data = await response.json();

            if (data.error) {
                unixResult.textContent = data.error;
                utcResult.textContent = data.error;
            } 
            else {
                unixResult.textContent = data.unix;
                utcResult.textContent = data.utc;
            }
        } 
        catch (error) {
            unixResult.textContent = 'Erro';    
            utcResult.textContent = 'Erro';
        }
    }   

    async function dataAtual() {
        try {
            const response = await fetch('/data-atual');
            const data = await response.json();

            unixAtual.textContent = data.unix;
            utcAtual.textContent = data.utc;
        } 
        catch (error) {
            unixAtual.textContent = 'Erro ao buscar data atual';
            utcAtual.textContent = 'Erro ao buscar data atual';
        }
    }

    async function calcularDiferenca() {
        difResult.textContent = '';
        const userInputDate1 = data1Input.value.trim();
        const userInputDate2 = data2Input.value.trim();

        try {
            const url = `/api/diff/${userInputDate1}/${userInputDate2}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                difResult.textContent = data.error;
            } 
            else {
                difResult.textContent = `Diferença: ${data.dias} dia(s), ${data.horas} hora(s), ${data.minutos} minuto(s) e ${data.segundos} segundo(s)`;
            }
        } 
        catch (error) {
            difResult.textContent = 'Erro ao calcular diferença';
        }
    }

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

    dataAtual();

    setInterval(dataAtual, 1000);
    
  })