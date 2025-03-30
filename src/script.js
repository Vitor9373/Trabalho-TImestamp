document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('valorDig');
    const button = document.getElementById('converte'); 
    const unixResult = document.getElementById('unixResult'); 
    const utcResult = document.getElementById('utcResult');
    const unixAtual = document.getElementById('unixAtual');
    const utcAtual = document.getElementById('utcAtual');
  
    async function convertDate() {
        input.innerHTML = '';
        const userInput = input.value.trim();

        try {
            const response = await fetch(`/api/${userInput}`)
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

    button.addEventListener('click', convertDate);

    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            convertDate();
        }
    });

    dataAtual();

    setInterval(dataAtual, 1000);
    
  })