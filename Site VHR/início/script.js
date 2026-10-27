// PEGAR O FORMULÁRIO
const formulario = document.querySelector("form");
// PEGAR O ANO ATUAL
const ano = document.getElementById("ano");
ano.textContent = new Date().getFullYear();
// QUANDO O FORMULÁRIO FOR ENVIADO
formulario.addEventListener("submit", function(event) {
    // Impede a página de recarregar
    event.preventDefault();
    // Pegar os valores dos campos
    const nome = document.querySelector(
        'input[placeholder="Nome completo"]'
    ).value;
    const modelo = document.querySelector(
        'input[placeholder="Modelo do caminhão"]'
    ).value;
    const placa = document.querySelector(
        'input[placeholder="Placa do caminhão"]'
    ).value;
    const telefone = document.querySelector(
        'input[placeholder="Telefone"]'
    ).value;
    const servico = document.querySelector("select").value;
    const problema = document.querySelector("textarea").value;
    // Verificar se os campos principais foram preenchidos
    if (
        nome === "" ||
        modelo === "" ||
        placa === "" ||
        telefone === "" ||
        servico === ""
    ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    // Mensagem de confirmação
    alert(
        "Agendamento realizado com sucesso!\n\n" +
        "Cliente: " + nome + "\n" +
        "Caminhão: " + modelo + "\n" +
        "Placa: " + placa + "\n" +
        "Telefone: " + telefone + "\n" +
        "Serviço: " + servico
    );
    // Limpar o formulário
    formulario.reset();
});