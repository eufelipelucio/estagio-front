const produtosContainer = document.getElementById("produtos");
const btnFornecedor = document.getElementById("btn-fornecedor");
const btnColetarValores = document.getElementById("btn-coletar-valores");
const anexosContainer = document.getElementById("anexos-container");
let countProdutos = 0;
let anexos = {};

const produtoComponent = (index) => {
    return `
        <div class="fs-display-flex fs-align-items-center produto-item" id="produto${index}">
            <div class="form-group fs-display-flex fs-margin-left-auto col-md-1">
                <button type="button" class="btn btn-danger btn-remove-produto text-light" onclick="removeProduto(${index})">
                    <img src="./assets/fluigicon-trash.png" alt="excluir produto" width="30">
                </button>
            </div>
            <div class="panel panel-default col-md-11">
                <div class="panel-heading fs-no-bg">
                    <h4 class="panel-title">Produto - <span class="produto-indice">${index}</span></h4>
                </div>
                <div class="form-row panel-body">
                    <div class="form-group col-md-2">
                        <i class="illustration illustration-package-diagram illustration-xl"></i>
                    </div>
                    <div class="form-group col-md-10">
                        <label>Produto</label>
                        <input type="text" class="form-control produtoDescricao" id="produtoDescricao${index}" required>
                    </div>
                    <div class="form-group col-md-2">
                        <label>UND. Medida</label>
                        <select class="form-control produtoUnidade" id="produtoUnidade${index}" required>
                            <option value="">Selecione</option>
                            <option value="kg">Kg</option>
                            <option value="un">Unidade</option>
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label>QTD. em Estoque</label>
                        <input type="number" class="form-control produtoQtde" id="produtoQtde${index}" required>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Valor Unitário</label>
                        <input type="number" class="form-control produtoValor" id="produtoValor${index}" step="0.01" required>
                    </div>
                    <div class="form-group col-md-2">
                        <label>Valor Total</label>
                        <input type="number" class="form-control produtoTotal" id="produtoTotal${index}" readonly>
                    </div>
                </div>
            </div>
        </div>`;
};

const addProduto = () => {
    countProdutos++;
    const novoProdutoHTML = produtoComponent(countProdutos);
    produtosContainer.insertAdjacentHTML('beforeend', novoProdutoHTML);

    const qtdeInput = document.getElementById(`produtoQtde${countProdutos}`);
    const valorInput = document.getElementById(`produtoValor${countProdutos}`);
    qtdeInput.addEventListener('input', calcularValorTotal);
    valorInput.addEventListener('input', calcularValorTotal);
};

const calcularValorTotal = (e) => {
    const index = e.target.id.match(/\d+$/)[0];
    const qtde = document.getElementById(`produtoQtde${index}`).value;
    const valor = document.getElementById(`produtoValor${index}`).value;
    const total = document.getElementById(`produtoTotal${index}`);
    total.value = (qtde * valor).toFixed(2);
};

btnFornecedor.addEventListener('click', (e) => {
    e.preventDefault();
    addProduto();
});

const removeProduto = (index) => {
    const produtoElement = document.getElementById(`produto${index}`);
    if (produtoElement) {
        produtosContainer.removeChild(produtoElement);
    }
};

const coletarValoresProdutos = () => {
    const produtos = [];
    for (let i = 1; i <= countProdutos; i++) {
        const produtoElement = document.getElementById(`produto${i}`);
        if (produtoElement) {
            const descricao = document.getElementById(`produtoDescricao${i}`).value;
            const unidade = document.getElementById(`produtoUnidade${i}`).value;
            const quantidade = document.getElementById(`produtoQtde${i}`).value;
            const valorUnitario = document.getElementById(`produtoValor${i}`).value;
            const valorTotal = document.getElementById(`produtoTotal${i}`).value;

            if (!descricao || !unidade || !quantidade || !valorUnitario || !valorTotal) {
                alert('Por favor, preencha todos os campos obrigatórios do produto.');
                return false;
            }

            produtos.push({
                descricao,
                unidade,
                quantidade: parseFloat(quantidade),
                valorUnitario: parseFloat(valorUnitario),
                valorTotal: parseFloat(valorTotal),
            });
        }
    }
    if (produtos.length === 0) {
        alert('Adicione pelo menos um produto.');
        return false;
    }
    return produtos;
};

const collectFormData = () => {
    const produtos = coletarValoresProdutos();
    if (!produtos) {
        return null;
    }
    if (Object.keys(anexos).length === 0) {
        alert('Adicione pelo menos um anexo.');
        return null;
    }


    const formData = {
        razaoSocial: document.getElementById('inputRazaoSocial').value,
        nomeFantasia: document.getElementById('inputNomeFantasia').value,
        cnpj: document.getElementById('inputCnpj').value,
        inscricaoEstadual: document.getElementById('inputInscricaoEstadual').value,
        inscricaoMunicipal: document.getElementById('inputInscricaoMunicipal').value,
        endereco: document.getElementById('inputEndereco').value,
        numero: document.getElementById('inputNumero').value,
        complemento: document.getElementById('inputComplemento').value,
        bairro: document.getElementById('inputBairro').value,
        municipio: document.getElementById('inputMunicipio').value,
        estado: document.getElementById('inputEstado').value,
        nomeContato: document.getElementById('inputNomeContato').value,
        telefone: document.getElementById('inputTelefone').value,
        email: document.getElementById('inputEmail').value,
        produtos,
        anexos: Object.values(anexos)
    };
    const obrigatorios = [
        'razaoSocial',
        'nomeFantasia',
        'cnpj',
        'endereco',
        'nomeContato',
        'telefone',
        'email'
    ];

    for (const campo of obrigatorios) {
        if (formData[campo] === '' || formData[campo] === null) {
            alert(`O campo ${campo.replace(/([A-Z])/g, ' $1').toLowerCase()} é obrigatório.`);
            return null;
        }
    }

    return formData;
};

btnColetarValores.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = collectFormData();
    if (formData) {
        mostrarModalLoading();
        console.log(formData);
        esconderModalLoading();
    }
});

const mostrarModalLoading = () => {
    console.log('Exibindo modal de loading...');
};

const esconderModalLoading = () => {
    console.log('Ocultando modal de loading...');
};

const adicionarAnexo = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const blob = new Blob([e.target.result], { type: file.type });
        const url = URL.createObjectURL(blob);
        anexos[file.name] = { blob, url };
        sessionStorage.setItem(file.name, url);
        mostrarAnexo(file.name, url);
    };
    reader.readAsArrayBuffer(file);
};

const mostrarAnexo = (name, url) => {
    const anexoHTML = `
        <div class="anexo-item fs-display-flex fs-align-items-center" id="anexo${name}">
            <button type="button" class="btn btn-danger" onclick="removerAnexo('${name}')"><img src="./assets/fluigicon-trash.png" alt="excluir" width="30" ></button>
            <button type="button" class="btn btn-info" onclick="visualizarAnexo('${name}')"><img src="./assets/fluigicon-eye-open.png" alt="vizualizar" width="30"></button>
            <span>${name}</span>
        </div>`;
    anexosContainer.insertAdjacentHTML('beforeend', anexoHTML);
};

const removerAnexo = (name) => {
    delete anexos[name];
    sessionStorage.removeItem(name);
    const anexoElement = document.getElementById(`anexo${name}`);
    if (anexoElement) {
        anexoElement.remove();
    }
};

const visualizarAnexo = (name) => {
    const url = anexos[name].url;
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
};

document.getElementById('inputAnexos').addEventListener('change', (e) => {
    const files = e.target.files;
    for (const file of files) {
        adicionarAnexo(file);
    }
});
