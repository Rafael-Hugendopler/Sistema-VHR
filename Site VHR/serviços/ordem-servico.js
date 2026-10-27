let servicos = JSON.parse(localStorage.getItem("vhr_ordens_servico")) || [];

let editandoId = null;


document.addEventListener("DOMContentLoaded", function () {

    atualizarNumeroOS();

    mostrarServicos();

    calcularTotal();

});


/* ================================
   NUMERO DA OS
================================ */

function atualizarNumeroOS() {

    const numero = servicos.length + 1;

    document.getElementById("numeroOS").textContent =
        String(numero).padStart(4, "0");

}


/* ================================
   ADICIONAR MANUTENCAO
================================ */

function adicionarManutencao() {

    const tabela = document.getElementById("listaManutencoes");

    const linha = document.createElement("tr");

    linha.innerHTML = `

        <td>

            <input
                type="text"
                class="manutencao"
                placeholder="Ex: Troca de freio"
            >

        </td>


        <td>

            <input
                type="text"
                class="descricao-manutencao"
                placeholder="Descricao"
            >

        </td>


        <td>

            <input
                type="number"
                step="0.01"
                class="valor-manutencao"
                placeholder="0,00"
                oninput="calcularTotal()"
            >

        </td>


        <td>

            <button
                type="button"
                class="remove-btn"
                onclick="removerManutencao(this)"
            >
                Excluir
            </button>

        </td>

    `;

    tabela.appendChild(linha);

}


/* ================================
   REMOVER MANUTENCAO
================================ */

function removerManutencao(botao) {

    const linhas =
        document.querySelectorAll("#listaManutencoes tr");

    if (linhas.length === 1) {

        alert("A ordem precisa ter pelo menos uma manutencao.");

        return;

    }

    botao.closest("tr").remove();

    calcularTotal();

}


/* ================================
   CALCULAR TOTAL
================================ */

function calcularTotal() {

    const valores =
        document.querySelectorAll(".valor-manutencao");

    let total = 0;

    valores.forEach(function (campo) {

        total += Number(campo.value) || 0;

    });

    document.getElementById("valorTotal").textContent =
        formatarMoeda(total);

}


/* ================================
   FORMATAR MOEDA
================================ */

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


/* ================================
   PEGAR MANUTENCOES
================================ */

function pegarManutencoes() {

    const linhas =
        document.querySelectorAll("#listaManutencoes tr");

    const manutencoes = [];

    linhas.forEach(function (linha) {

        const nome =
            linha.querySelector(".manutencao").value;

        const descricao =
            linha.querySelector(".descricao-manutencao").value;

        const valor =
            Number(
                linha.querySelector(".valor-manutencao").value
            ) || 0;


        if (nome.trim() !== "") {

            manutencoes.push({

                nome: nome,

                descricao: descricao,

                valor: valor

            });

        }

    });

    return manutencoes;

}


/* ================================
   CALCULAR VALOR TOTAL
================================ */

function calcularValorTotal(manutencoes) {

    return manutencoes.reduce(function (total, item) {

        return total + Number(item.valor);

    }, 0);

}


/* ================================
   CADASTRAR SERVICO
================================ */

document
    .getElementById("formOrdemServico")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const cliente =
            document.getElementById("cliente").value.trim();

        const telefone =
            document.getElementById("telefone").value.trim();

        const veiculo =
            document.getElementById("veiculo").value.trim();

        const placa =
            document.getElementById("placa").value.trim();

        const tipoServico =
            document.getElementById("tipoServico").value;

        const status =
            document.getElementById("status").value;

        const quilometragem =
            document.getElementById("quilometragem").value;

        const entrada =
            document.getElementById("entrada").value;

        const saida =
            document.getElementById("saida").value;

        const descricao =
            document.getElementById("descricao").value.trim();

        const observacoes =
            document.getElementById("observacoes").value.trim();


        const manutencoes =
            pegarManutencoes();


        if (!cliente) {

            alert("Digite o nome do cliente.");

            return;

        }


        if (!tipoServico) {

            alert("Selecione o tipo de servico.");

            return;

        }


        if (manutencoes.length === 0) {

            alert("Adicione pelo menos uma manutencao.");

            return;

        }


        const valorTotal =
            calcularValorTotal(manutencoes);


        if (editandoId !== null) {

            const index =
                servicos.findIndex(
                    servico => servico.id === editandoId
                );


            if (index !== -1) {

                servicos[index] = {

                    ...servicos[index],

                    cliente,
                    telefone,
                    veiculo,
                    placa,
                    tipoServico,
                    status,
                    quilometragem,
                    entrada,
                    saida,
                    descricao,
                    observacoes,
                    manutencoes,
                    valorTotal

                };

            }


            editandoId = null;


        } else {

            const novoServico = {

                id: Date.now(),

                numeroOS:
                    servicos.length + 1,

                cliente,

                telefone,

                veiculo,

                placa,

                tipoServico,

                status,

                quilometragem,

                entrada,

                saida,

                descricao,

                observacoes,

                manutencoes,

                valorTotal,

                dataCadastro:
                    new Date().toISOString()

            };


            servicos.push(novoServico);

        }


        localStorage.setItem(
            "vhr_ordens_servico",
            JSON.stringify(servicos)
        );


        alert("Servico cadastrado com sucesso!");


        limparFormulario();

        mostrarServicos();

        atualizarNumeroOS();

    });


/* ================================
   MOSTRAR SERVICOS
================================ */

function mostrarServicos() {

    const lista =
        document.getElementById("listaServicos");

    const contador =
        document.getElementById("contadorServicos");


    contador.textContent =
        servicos.length +
        (servicos.length === 1 ? " servico" : " servicos");


    if (servicos.length === 0) {

        lista.innerHTML = `

            <div class="empty-list">

                Nenhum servico cadastrado ainda.

            </div>

        `;

        return;

    }


    lista.innerHTML = "";


    [...servicos].reverse().forEach(function (servico) {

        const card =
            document.createElement("div");

        card.className = "service-card";


        card.innerHTML = `

            <div class="service-card-top">

                <div>

                    <h3>

                        <span class="service-os">
                            OS ${String(servico.numeroOS).padStart(4, "0")}
                        </span>

                        - ${servico.tipoServico}

                    </h3>


                    <p>
                        Cliente: <strong>${servico.cliente}</strong>
                    </p>


                    <p>
                        Veiculo: <strong>${servico.veiculo}</strong>
                    </p>

                </div>


                <span class="service-status">
                    ${servico.status}
                </span>

            </div>


            <div class="service-info">

                <div class="service-info-item">

                    <span>
                        Placa
                    </span>

                    <strong>
                        ${servico.placa || "-"}
                    </strong>

                </div>


                <div class="service-info-item">

                    <span>
                        Entrada
                    </span>

                    <strong>
                        ${formatarData(servico.entrada)}
                    </strong>

                </div>


                <div class="service-info-item">

                    <span>
                        Manutencoes
                    </span>

                    <strong>
                        ${servico.manutencoes.length}
                    </strong>

                </div>


                <div class="service-info-item">

                    <span>
                        Valor total
                    </span>

                    <strong>
                        ${formatarMoeda(servico.valorTotal)}
                    </strong>

                </div>

            </div>


            <div class="service-card-actions">

                <button
                    class="action-view"
                    onclick="visualizarServico(${servico.id})"
                >
                    Visualizar
                </button>


                <button
                    class="action-edit"
                    onclick="editarServico(${servico.id})"
                >
                    Editar
                </button>


                <button
                    class="action-delete"
                    onclick="excluirServico(${servico.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        lista.appendChild(card);

    });

}


/* ================================
   FORMATAR DATA
================================ */

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const dataObj =
        new Date(data);


    if (isNaN(dataObj.getTime())) {

        return data;

    }


    return dataObj.toLocaleString("pt-BR");

}


/* ================================
   VISUALIZAR
================================ */

function visualizarServico(id) {

    const servico =
        servicos.find(
            item => item.id === id
        );


    if (!servico) {

        return;

    }


    let texto =
        "OS Nº " +
        String(servico.numeroOS).padStart(4, "0") +
        "\n\n";


    texto +=
        "Cliente: " +
        servico.cliente +
        "\n";

    texto +=
        "Telefone: " +
        (servico.telefone || "-") +
        "\n";

    texto +=
        "Veiculo: " +
        servico.veiculo +
        "\n";

    texto +=
        "Placa: " +
        (servico.placa || "-") +
        "\n";

    texto +=
        "Tipo: " +
        servico.tipoServico +
        "\n";

    texto +=
        "Status: " +
        servico.status +
        "\n\n";


    texto +=
        "MANUTENCOES\n\n";


    servico.manutencoes.forEach(function (item, index) {

        texto +=
            (index + 1) +
            ". " +
            item.nome +
            " - " +
            formatarMoeda(item.valor) +
            "\n";

        if (item.descricao) {

            texto +=
                "   " +
                item.descricao +
                "\n";

        }

    });


    texto +=
        "\nTOTAL: " +
        formatarMoeda(servico.valorTotal);


    alert(texto);

}


/* ================================
   EDITAR
================================ */

function editarServico(id) {

    const servico =
        servicos.find(
            item => item.id === id
        );


    if (!servico) {

        return;

    }


    editandoId = id;


    document.getElementById("cliente").value =
        servico.cliente;

    document.getElementById("telefone").value =
        servico.telefone;

    document.getElementById("veiculo").value =
        servico.veiculo;

    document.getElementById("placa").value =
        servico.placa;

    document.getElementById("tipoServico").value =
        servico.tipoServico;

    document.getElementById("status").value =
        servico.status;

    document.getElementById("quilometragem").value =
        servico.quilometragem;

    document.getElementById("entrada").value =
        servico.entrada;

    document.getElementById("saida").value =
        servico.saida;

    document.getElementById("descricao").value =
        servico.descricao;

    document.getElementById("observacoes").value =
        servico.observacoes;


    const tabela =
        document.getElementById("listaManutencoes");


    tabela.innerHTML = "";


    servico.manutencoes.forEach(function (item) {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>

                <input
                    type="text"
                    class="manutencao"
                    value="${item.nome}"
                >

            </td>


            <td>

                <input
                    type="text"
                    class="descricao-manutencao"
                    value="${item.descricao || ""}"
                >

            </td>


            <td>

                <input
                    type="number"
                    step="0.01"
                    class="valor-manutencao"
                    value="${item.valor}"
                    oninput="calcularTotal()"
                >

            </td>


            <td>

                <button
                    type="button"
                    class="remove-btn"
                    onclick="removerManutencao(this)"
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });


    calcularTotal();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    document.querySelector(
        ".btn-primary"
    ).textContent = "✓ Salvar alteracoes";

}


/* ================================
   EXCLUIR
================================ */

function excluirServico(id) {

    const servico =
        servicos.find(
            item => item.id === id
        );


    if (!servico) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja realmente excluir a OS " +
            String(servico.numeroOS).padStart(4, "0") +
            "?"
        );


    if (!confirmar) {

        return;

    }


    servicos =
        servicos.filter(
            item => item.id !== id
        );


    servicos.forEach(function (item, index) {

        item.numeroOS = index + 1;

    });


    localStorage.setItem(
        "vhr_ordens_servico",
        JSON.stringify(servicos)
    );


    mostrarServicos();

    atualizarNumeroOS();

}


/* ================================
   LIMPAR FORMULARIO
================================ */

function limparFormulario() {

    document
        .getElementById("formOrdemServico")
        .reset();


    editandoId = null;


    const tabela =
        document.getElementById("listaManutencoes");


    tabela.innerHTML = `

        <tr>

            <td>

                <input
                    type="text"
                    class="manutencao"
                    placeholder="Ex: Troca de oleo"
                >

            </td>


            <td>

                <input
                    type="text"
                    class="descricao-manutencao"
                    placeholder="Descricao"
                >

            </td>


            <td>

                <input
                    type="number"
                    step="0.01"
                    class="valor-manutencao"
                    placeholder="0,00"
                    oninput="calcularTotal()"
                >

            </td>


            <td>

                <button
                    type="button"
                    class="remove-btn"
                    onclick="removerManutencao(this)"
                >
                    Excluir
                </button>

            </td>

        </tr>

    `;


    document.querySelector(
        ".btn-primary"
    ).textContent = "✓ Cadastrar servico";


    calcularTotal();

}


/* ================================
   GERAR PDF
================================ */

function gerarPDF() {

    const { jsPDF } =
        window.jspdf;


    const cliente =
        document.getElementById("cliente").value;

    const telefone =
        document.getElementById("telefone").value;

    const veiculo =
        document.getElementById("veiculo").value;

    const placa =
        document.getElementById("placa").value;

    const tipo =
        document.getElementById("tipoServico").value;

    const status =
        document.getElementById("status").value;

    const entrada =
        document.getElementById("entrada").value;

    const saida =
        document.getElementById("saida").value;

    const quilometragem =
        document.getElementById("quilometragem").value;

    const descricao =
        document.getElementById("descricao").value;

    const observacoes =
        document.getElementById("observacoes").value;


    const manutencoes =
        pegarManutencoes();


    const total =
        calcularValorTotal(manutencoes);


    const pdf =
        new jsPDF();


    let y = 20;


    pdf.setFontSize(20);

    pdf.setFont("helvetica", "bold");

    pdf.text(
        "VHR TRUCK CENTER",
        20,
        y
    );


    y += 8;


    pdf.setFontSize(11);

    pdf.setFont("helvetica", "normal");

    pdf.text(
        "MECANICA DIESEL",
        20,
        y
    );


    y += 12;


    pdf.setFontSize(16);

    pdf.setFont("helvetica", "bold");

    pdf.text(
        "ORDEM DE SERVICO",
        20,
        y
    );


    y += 10;


    pdf.setFontSize(11);

    pdf.setFont("helvetica", "normal");


    pdf.text(
        "OS Nº " +
        document.getElementById("numeroOS").textContent,
        20,
        y
    );


    y += 12;


    pdf.setFont("helvetica", "bold");

    pdf.text(
        "CLIENTE E VEICULO",
        20,
        y
    );


    y += 8;

    pdf.setFont("helvetica", "normal");


    pdf.text(
        "Cliente: " + cliente,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Telefone: " + telefone,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Veiculo: " + veiculo,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Placa: " + placa,
        20,
        y
    );

    y += 10;


    pdf.setFont("helvetica", "bold");

    pdf.text(
        "DADOS DO SERVICO",
        20,
        y
    );


    y += 8;

    pdf.setFont("helvetica", "normal");


    pdf.text(
        "Tipo: " + tipo,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Status: " + status,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Quilometragem: " + quilometragem,
        20,
        y
    );

    y += 6;


    pdf.text(
        "Entrada: " + formatarData(entrada),
        20,
        y
    );

    y += 6;


    pdf.text(
        "Saida: " + formatarData(saida),
        20,
        y
    );

    y += 10;


    pdf.setFont("helvetica", "bold");

    pdf.text(
        "MANUTENCOES",
        20,
        y
    );


    y += 8;

    pdf.setFont("helvetica", "normal");


    manutencoes.forEach(function (item, index) {

        if (y > 270) {

            pdf.addPage();

            y = 20;

        }


        pdf.text(
            (index + 1) +
            ". " +
            item.nome,
            20,
            y
        );


        pdf.text(
            formatarMoeda(item.valor),
            150,
            y
        );


        y += 6;


        if (item.descricao) {

            pdf.setFontSize(9);

            pdf.text(
                item.descricao,
                25,
                y
            );

            pdf.setFontSize(11);

            y += 6;

        }

    });


    y += 5;


    pdf.setFont("helvetica", "bold");

    pdf.text(
        "TOTAL: " +
        formatarMoeda(total),
        20,
        y
    );


    y += 12;


    pdf.text(
        "DESCRICAO",
        20,
        y
    );


    y += 7;

    pdf.setFont("helvetica", "normal");


    const descricaoLinhas =
        pdf.splitTextToSize(
            descricao || "-",
            170
        );


    pdf.text(
        descricaoLinhas,
        20,
        y
    );


    y +=
        descricaoLinhas.length * 5 +
        8;


    pdf.setFont("helvetica", "bold");

    pdf.text(
        "OBSERVACOES",
        20,
        y
    );


    y += 7;

    pdf.setFont("helvetica", "normal");


    const observacoesLinhas =
        pdf.splitTextToSize(
            observacoes || "-",
            170
        );


    pdf.text(
        observacoesLinhas,
        20,
        y
    );


    pdf.save(
        "ordem-servico-" +
        document.getElementById("numeroOS").textContent +
        ".pdf"
    );

}