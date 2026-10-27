// ============================================
// VHR TRUCK CENTER
// SISTEMA FINANCEIRO
// ============================================


// ============================================
// ELEMENTOS
// ============================================

const form = document.getElementById("financeForm");

const tipo = document.getElementById("tipo");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");
const valor = document.getElementById("valor");
const data = document.getElementById("data");

const pesquisa = document.getElementById("pesquisa");
const periodo = document.getElementById("periodo");
const filtroTipo = document.getElementById("filtroTipo");

const tabelaReceitas = document.getElementById("tabelaReceitas");
const tabelaDespesas = document.getElementById("tabelaDespesas");

const totalRecebido = document.getElementById("totalRecebido");
const totalDespesas = document.getElementById("totalDespesas");
const totalLucro = document.getElementById("totalLucro");


// ============================================
// LOCALSTORAGE
// ============================================

let movimentacoes = JSON.parse(
    localStorage.getItem("vhr_movimentacoes")
) || [];


// ============================================
// DATA ATUAL
// ============================================

const hoje = new Date();

const ano = hoje.getFullYear();

const mes = String(
    hoje.getMonth() + 1
).padStart(2, "0");

const dia = String(
    hoje.getDate()
).padStart(2, "0");

data.value = `${ano}-${mes}-${dia}`;


// ============================================
// FORMATAÇÃO DE DINHEIRO
// ============================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ============================================
// FORMATAR DATA
// ============================================

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ============================================
// SALVAR
// ============================================

function salvarMovimentacoes() {

    localStorage.setItem(
        "vhr_movimentacoes",
        JSON.stringify(movimentacoes)
    );

}


// ============================================
// ADICIONAR MOVIMENTAÇÃO
// ============================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const tipoValor = tipo.value;

    const descricaoValor = descricao.value.trim();

    const categoriaValor = categoria.value;

    const valorNumero = Number(valor.value);

    const dataValor = data.value;


    // ========================================
    // VALIDAÇÕES
    // ========================================

    if (!descricaoValor) {

        alert("Digite uma descrição.");

        descricao.focus();

        return;

    }


    if (!valorNumero || valorNumero <= 0) {

        alert("Digite um valor válido.");

        valor.focus();

        return;

    }


    if (!dataValor) {

        alert("Selecione uma data.");

        data.focus();

        return;

    }


    // ========================================
    // NOVA MOVIMENTAÇÃO
    // ========================================

    const novaMovimentacao = {

        id: Date.now(),

        tipo: tipoValor,

        descricao: descricaoValor,

        categoria: categoriaValor,

        valor: valorNumero,

        data: dataValor

    };


    // ========================================
    // ADICIONA NO ARRAY
    // ========================================

    movimentacoes.push(novaMovimentacao);


    // ========================================
    // SALVA
    // ========================================

    salvarMovimentacoes();


    // ========================================
    // ATUALIZA TELA
    // ========================================

    atualizarSistema();


    // ========================================
    // LIMPA FORMULÁRIO
    // ========================================

    descricao.value = "";

    valor.value = "";

    data.value = `${ano}-${mes}-${dia}`;


    alert("Movimentação adicionada com sucesso!");

});


// ============================================
// FILTROS
// ============================================

pesquisa.addEventListener(
    "input",
    atualizarSistema
);

periodo.addEventListener(
    "change",
    atualizarSistema
);

filtroTipo.addEventListener(
    "change",
    atualizarSistema
);


// ============================================
// FILTRAR MOVIMENTAÇÕES
// ============================================

function obterMovimentacoesFiltradas() {

    let resultado = [...movimentacoes];


    // ========================================
    // FILTRO DE TEXTO
    // ========================================

    const texto = pesquisa.value
        .trim()
        .toLowerCase();


    if (texto) {

        resultado = resultado.filter(
            function(movimentacao) {

                return (

                    movimentacao.descricao
                        .toLowerCase()
                        .includes(texto)

                    ||

                    movimentacao.categoria
                        .toLowerCase()
                        .includes(texto)

                );

            }
        );

    }


    // ========================================
    // FILTRO DE TIPO
    // ========================================

    if (filtroTipo.value !== "todos") {

        resultado = resultado.filter(
            function(movimentacao) {

                return movimentacao.tipo === filtroTipo.value;

            }
        );

    }


    // ========================================
    // FILTRO DE PERÍODO
    // ========================================

    if (periodo.value !== "todos") {

        const quantidadeDias = Number(
            periodo.value
        );


        const limite = new Date();

        limite.setHours(
            0,
            0,
            0,
            0
        );


        limite.setDate(
            limite.getDate() - quantidadeDias
        );


        resultado = resultado.filter(
            function(movimentacao) {

                const dataMovimentacao =
                    new Date(
                        movimentacao.data + "T00:00:00"
                    );


                return dataMovimentacao >= limite;

            }
        );

    }


    return resultado;

}


// ============================================
// ATUALIZAR SISTEMA
// ============================================

function atualizarSistema() {

    const movimentacoesFiltradas =
        obterMovimentacoesFiltradas();


    atualizarTotais();

    mostrarReceitas(
        movimentacoesFiltradas
    );

    mostrarDespesas(
        movimentacoesFiltradas
    );

}


// ============================================
// ATUALIZAR OS 3 CARDS
// ============================================

function atualizarTotais() {

    let recebido = 0;

    let despesas = 0;


    movimentacoes.forEach(
        function(movimentacao) {

            if (
                movimentacao.tipo === "entrada"
            ) {

                recebido += Number(
                    movimentacao.valor
                );

            }


            if (
                movimentacao.tipo === "despesa"
            ) {

                despesas += Number(
                    movimentacao.valor
                );

            }

        }
    );


    const lucro = recebido - despesas;


    totalRecebido.textContent =
        formatarMoeda(recebido);


    totalDespesas.textContent =
        formatarMoeda(despesas);


    totalLucro.textContent =
        formatarMoeda(lucro);

}


// ============================================
// MOSTRAR RECEITAS
// ============================================

function mostrarReceitas(lista) {

    tabelaReceitas.innerHTML = "";


    const receitas = lista.filter(
        function(movimentacao) {

            return movimentacao.tipo === "entrada";

        }
    );


    if (receitas.length === 0) {

        tabelaReceitas.innerHTML = `

            <tr>

                <td colspan="6" style="text-align:center;">
                    Nenhuma receita encontrada.
                </td>

            </tr>

        `;

        return;

    }


    receitas
        .sort(
            function(a, b) {

                return b.data.localeCompare(
                    a.data
                );

            }
        )
        .forEach(
            function(movimentacao) {

                const linha =
                    document.createElement("tr");


                linha.innerHTML = `

                    <td>
                        ${escaparHTML(
                            movimentacao.descricao
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            movimentacao.categoria
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            movimentacao.data
                        )}
                    </td>

                    <td class="money-positive">
                        + ${formatarMoeda(
                            movimentacao.valor
                        )}
                    </td>

                    <td>
                        <span class="finance-status">
                            Recebido
                        </span>
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="excluirMovimentacao(${movimentacao.id})"
                            style="
                                border:none;
                                background:none;
                                color:#ff6b6b;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            Excluir
                        </button>

                    </td>

                `;


                tabelaReceitas.appendChild(
                    linha
                );

            }
        );

}


// ============================================
// MOSTRAR DESPESAS
// ============================================

function mostrarDespesas(lista) {

    tabelaDespesas.innerHTML = "";


    const despesas = lista.filter(
        function(movimentacao) {

            return movimentacao.tipo === "despesa";

        }
    );


    if (despesas.length === 0) {

        tabelaDespesas.innerHTML = `

            <tr>

                <td colspan="5" style="text-align:center;">
                    Nenhuma despesa encontrada.
                </td>

            </tr>

        `;

        return;

    }


    despesas
        .sort(
            function(a, b) {

                return b.data.localeCompare(
                    a.data
                );

            }
        )
        .forEach(
            function(movimentacao) {

                const linha =
                    document.createElement("tr");


                linha.innerHTML = `

                    <td>
                        ${escaparHTML(
                            movimentacao.descricao
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            movimentacao.categoria
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            movimentacao.data
                        )}
                    </td>

                    <td class="money-negative">
                        - ${formatarMoeda(
                            movimentacao.valor
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="excluirMovimentacao(${movimentacao.id})"
                            style="
                                border:none;
                                background:none;
                                color:#ff6b6b;
                                cursor:pointer;
                                font-weight:bold;
                            "
                        >
                            Excluir
                        </button>

                    </td>

                `;


                tabelaDespesas.appendChild(
                    linha
                );

            }
        );

}


// ============================================
// EXCLUIR MOVIMENTAÇÃO
// ============================================

function excluirMovimentacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta movimentação?"
        );


    if (!confirmar) {

        return;

    }


    movimentacoes =
        movimentacoes.filter(
            function(movimentacao) {

                return movimentacao.id !== id;

            }
        );


    salvarMovimentacoes();

    atualizarSistema();

}


// ============================================
// PROTEÇÃO CONTRA HTML
// ============================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


// ============================================
// INICIAR SISTEMA
// ============================================

atualizarSistema();