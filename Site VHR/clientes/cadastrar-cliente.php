<?php

require_once __DIR__ . "/../config/conexao.php";

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["nome"])) {

    $nome = $_GET["nome"] ?? "";
    $cpf = $_GET["cpf"] ?? "";
    $telefone = $_GET["telefone"] ?? "";
    $email = $_GET["email"] ?? "";
    $endereco = $_GET["endereco"] ?? "";
    $cidade = $_GET["cidade"] ?? "";
    $estado = $_GET["estado"] ?? "";
    $cep = $_GET["cep"] ?? "";
    $observacoes = $_GET["observacoes"] ?? "";

    $sql = "INSERT INTO Clientes
            (nome, cpf_cnpj, telefone, email, endereco, cidade, estado, cep, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $params = [
        $nome,
        $cpf,
        $telefone,
        $email,
        $endereco,
        $cidade,
        $estado,
        $cep,
        $observacoes
    ];

    $resultado = sqlsrv_query($conn, $sql, $params);

    if ($resultado === false) {
        echo "<pre>";
        print_r(sqlsrv_errors());
        echo "</pre>";
        exit;
    }

    echo "<script>
        alert('Cliente cadastrado com sucesso!');
        window.location.href = 'clientes.html';
    </script>";

    exit;
}

?>

<!DOCTYPE html>

<html lang="pt-BR">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>VHR Truck Center | Cadastrar Cliente</title>

    <link rel="stylesheet" href="../início/projeto.css">

</head>

<body>

<div class="system">

    <aside class="sidebar">

        <div class="logo-area">

            <div class="logo">
                <img src="logo-vhr-transparente.png" alt="VHR Truck Center">
            </div>

            <div class="brand">
                <strong>TRUCK CENTER</strong>
                <span>MECÂNICA DIESEL</span>
            </div>

        </div>

        <div class="menu">

            <p class="menu-title">
                MENU PRINCIPAL
            </p>

            <a href="../início/dashboard.html" class="menu-item">
                <span>⌂</span>
                Dashboard
            </a>

            <a href="clientes.html" class="menu-item active">
                <span>♙</span>
                Clientes
            </a>

            <a href="../veículos/veiculos.html" class="menu-item">
                <span>▣</span>
                Veículos
            </a>

            <a href="../serviços/ordem-servico.html" class="menu-item">
                <span>⚙</span>
                Ordem de Serviço
            </a>

            <a href="../peças/peças.html" class="menu-item">
                <span>▤</span>
                Peças
            </a>

            <a href="../início/financeiro.html" class="menu-item">
                <span>R$</span>
                Financeiro
            </a>

            <p class="menu-title sistema-title">
                SISTEMA
            </p>

            <a href="../início/configurações.html" class="menu-item">
                <span>⚙</span>
                Configurações
            </a>

            <a href="../início/projeto.html" class="logout">
                ↪ Sair
            </a>

        </div>

        <div class="user-area">

            <div class="user-name">
                VH
            </div>

            <div>
                <strong>Administrador</strong>
                <small>Usuário ativo</small>
            </div>

        </div>

    </aside>

    <main class="main">

        <header class="topbar">

            <div>

                <p class="welcome">
                    CLIENTES
                </p>

                <h1>
                    Cadastrar cliente
                </h1>

                <p class="subtitle">
                    Cadastre um novo cliente no sistema.
                </p>

            </div>

            <a href="clientes.html" class="back-button">
                ← Voltar para clientes
            </a>

        </header>

        <section class="panel form-panel edit-client-panel">

            <div class="panel-header">

                <div>

                    <span class="section-label">
                        CADASTRO
                    </span>

                    <h2>
                        Dados do cliente
                    </h2>

                </div>

            </div>

            <form id="formCliente">

                <div class="form-section">

                    <div class="form-grid">

                        <div class="form-group">

                            <label for="nome">
                                NOME COMPLETO
                            </label>

                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                required
                            >

                        </div>

                        <div class="form-group">

                            <label for="cpf">
                                CPF / CNPJ
                            </label>

                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                required
                            >

                        </div>

                        <div class="form-group">

                            <label for="telefone">
                                TELEFONE
                            </label>

                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                required
                            >

                        </div>

                        <div class="form-group">

                            <label for="email">
                                E-MAIL
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                            >

                        </div>

                    </div>

                </div>

                <div class="form-section">

                    <div class="form-grid">

                        <div class="form-group form-full">

                            <label for="endereco">
                                ENDEREÇO
                            </label>

                            <input
                                type="text"
                                id="endereco"
                                name="endereco"
                                required
                            >

                        </div>

                        <div class="form-group">

                            <label for="cidade">
                                CIDADE
                            </label>

                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                required
                            >

                        </div>

                        <div class="form-group">

                            <label for="estado">
                                ESTADO
                            </label>

                            <select
                                id="estado"
                                name="estado"
                                required
                            >

                                <option value="">
                                    Selecione
                                </option>

                                <option value="RS">
                                    RS
                                </option>

                                <option value="SC">
                                    SC
                                </option>

                                <option value="PR">
                                    PR
                                </option>

                                <option value="SP">
                                    SP
                                </option>

                            </select>

                        </div>

                        <div class="form-group">

                            <label for="cep">
                                CEP
                            </label>

                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                required
                            >

                        </div>

                    </div>

                </div>

                <div class="form-section">

                    <div class="form-group">

                        <label for="observacoes">
                            OBSERVAÇÕES
                        </label>

                        <textarea
                            id="observacoes"
                            name="observacoes"
                        ></textarea>

                    </div>

                </div>

                <div class="form-actions">

                    <a
                        href="clientes.html"
                        class="cancel-button"
                    >
                        Cancelar
                    </a>

                    <button
                        type="submit"
                        class="save-button"
                    >
                        Cadastrar cliente
                    </button>

                </div>

            </form>

        </section>

    </main>

</div>

</body>

</html>