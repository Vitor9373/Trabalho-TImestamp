async function convertDate() {
    const input = document.getElementById('valorDig').value;
    const unixResult = document.getElementById('unixResult');
    const utcResult = document.getElementById('utcResult');

    unixResult.textContent = '';
    utcResult.textContent = '';
    console.log("top");
    try {
        const response = await fetch(`/api/${input}`);
        console.log('Resposta do servidor:', response);

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();

        if (data.error) {
            unixResult.textContent = 'Erro';
            utcResult.textContent = data.error;
        } 
        else {
            unixResult.textContent = data.unix;
            utcResult.textContent = data.utc;
        }
    } catch (error) {
        console.error('Erro:', error);
        unixResult.textContent = 'Erro';
        utcResult.textContent = 'Falha ao processar a requisição.';
    }
}

document.getElementById('converte').addEventListener('click', convertDate());

document.getElementById('valorDig').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        convertDate();
    }
});
