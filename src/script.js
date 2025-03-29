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
            const response = await fetch(`/api/${userInput}`);
            const data = await response.json();

            if (data.error) {
                unixResult.textContent = data.error;
                utcResult.textContent = data.error;
            } else {
                unixResult.textContent = data.unix;
                utcResult.textContent = data.utc;
            }
        } 
        catch (error) {
            unixResult.textContent = 'Erro';    
            utcResult.textContent = 'Erro';
        }
    }

    button.addEventListener('click', convertDate);

    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            convertDate();
        }
    });
  })