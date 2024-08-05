const inputCEP = document.getElementById('inputCEP');

inputCEP.addEventListener('blur', async () => {
    let cep = inputCEP.value;
    if (cep !== "") {
        try {
            let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Network response was not ok');
            let data = await response.json();
            if (!("erro" in data)) {
                document.getElementById('inputEndereco').value = data.logradouro;
                document.getElementById('inputBairro').value = data.bairro;
                document.getElementById('inputMunicipio').value = data.localidade;
                document.getElementById('inputEstado').value = data.uf;
            } else {
                alert("CEP não encontrado.");
            }
        } catch (error) {
            alert("Erro ao buscar o CEP.");
            console.error("Fetch error: ", error);
        }
    }
});