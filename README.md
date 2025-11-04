# 🧠 Projeto TCC: Automação de E-commerce com n8n e IA Generativa

Este repositório contém os fluxos de trabalho (workflows) desenvolvidos em [n8n](https://n8n.io/) para o meu **Trabalho de Conclusão de Curso (TCC)**.
O projeto demonstra a criação de um **assistente de vendas virtual** para uma loja de roupas, integrando um **chatbot no Telegram** com a **IA Generativa da Google (Gemini)**.


---

## 📌 Visão Geral dos Cenários

O projeto é dividido em **três fluxos de trabalho principais**, cada um representando um nível de complexidade e funcionalidade.

| Cenário | Nome do Fluxo                | Descrição                                                                                                                                                                                |
| :-----: | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **1** | `Boas-Vindas Simples`        | Um bot de entrada que responde a qualquer mensagem com uma saudação calorosa gerada por IA. Ideal para validar a conexão entre Telegram e Gemini.                                             |
|  **2** | `Assistente de Vendas`       | Uma assistente virtual (Clô) que gerencia uma conversa completa, entende a intenção do usuário, consulta um catálogo de produtos via API e salva o estado da conversa no Redis.              |
|  **3** | `Notificação de Lançamento`  | Um sistema proativo que, ao receber um novo produto via webhook, busca no Redis todos os usuários interessados naquela categoria e envia uma notificação de lançamento personalizada com IA. |

---

## ✨ Tecnologias Utilizadas

-   **Plataforma de Automação:** [n8n](https://n8n.io/)
-   **Inteligência Artificial:** [Google Gemini (via Google AI Studio)](https://aistudio.google.com/)
-   **Mensageria:** [Telegram](https://telegram.org/)
-   **Banco de Dados:** [Redis](https://redis.io/) — armazenamento do estado da conversa e inscrições de categorias
-   **API Local:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — simulação do catálogo de produtos
-   **Orquestração:** [Docker](https://www.docker.com/)

---

## ⚙️ Configuração e Pré-requisitos

Para executar os fluxos de trabalho, configure o ambiente conforme as etapas abaixo.

### 1️⃣ Instância do n8n

-   Use o **n8n Desktop**, **n8n Cloud** ou hospede via **Docker**.
-   **Importe os fluxos:** Baixe os arquivos `.json` na pasta `fluxos` e importe pela interface do n8n.

### 2️⃣ Credenciais Necessárias

Configure as credenciais no n8n (`Credentials > Add credential`):

#### 🔹 Telegram Bot Token
1.  Converse com o [@BotFather](https://t.me/BotFather) e use `/newbot`.
2.  Copie o token gerado.
3.  No n8n, adicione uma credencial do tipo **Telegram Bot API**.

#### 🔹 Google Gemini API
1.  Acesse o [Google AI Studio](https://aistudio.google.com/).
2.  Clique em **“Get API Key”** e copie sua chave.
3.  No n8n, crie uma credencial **Google Gemini API**.

#### 🔹 Redis
1.  Crie uma credencial **Redis** no n8n.
2.  Se estiver rodando via Docker localmente, use:
    -   **Host:** `localhost`
    -   **Porta:** `6379`

### 3️⃣ Dependências Externas (para Cenários 2 e 3)

Esses cenários utilizam serviços adicionais que precisam estar em execução.

#### 🗄️ Banco de Dados Redis
Necessário para salvar o estado da conversa e as inscrições dos usuários.

Execute com Docker:
```bash
docker run --name meu-redis -p 6379:6379 -d redis
```

#### 🛍️ API de Produtos Local
Esta API, construída com Node.js e Express, simula o backend de uma loja virtual. Sua principal função é fornecer os dados do catálogo de produtos. A base de dados é um simples arquivo `db.json`, facilitando a prototipação.

**Endpoints Disponíveis:**
-   `GET /produtos`: Retorna a lista completa de todos os produtos.
-   `GET /produtos?categoria=<nome_da_categoria>`: Filtra e retorna apenas os produtos que pertencem à categoria especificada.
-   `GET /categorias`: Retorna a lista de todas as categorias de produtos disponíveis.

**▶️ Como Rodar a API Local:**
1.  Navegue até o diretório da API:
    ```bash
    cd api
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    node app.js
    ```
    A API estará em execução em `http://localhost:3000`.

---

## 🚀 Como Executar os Fluxos

1.  **Inicie as Dependências:** Certifique-se de que o contêiner do **Redis** e o servidor da **API local** estejam em execução.
2.  **Importe os Fluxos:** Importe os três arquivos `.json` da pasta `fluxos` para sua instância do n8n.
3.  **Configure as Credenciais:** Associe as credenciais criadas (Telegram, Gemini, Redis) aos nós correspondentes dentro de cada fluxo.
4.  **Ative os Fluxos:** Ative o fluxo desejado clicando no interruptor **"Active"**.
5.  **Teste no Telegram:** Envie uma mensagem para o seu bot e veja a automação funcionar.

---

## 🔗 Endpoint do Webhook (Cenário 3)

O fluxo do Cenário 3 expõe um endpoint `POST` para receber novos lançamentos de produtos.

📍 **Endpoint:**
`http://SEU_SERVIDOR_N8N:5678/webhook/a4f5d090-4382-4e89-8f7c-65e942cc935d`

*Observação: A URL do webhook é gerada pelo n8n. Substitua pelo endpoint do seu fluxo.*

🧾 **Exemplo de Payload (JSON):**
```json
{
  "nome": "Jaqueta Cargo Oversized",
  "descricao": "Jaqueta em sarja com bolsos utilitários e corte urbano.",
  "categoria": "Jaquetas",
  "preco": 259.90,
  "imagem_url": "https://exemplo.com/imagens/jaqueta-cargo.jpg"
}
```

🧪 **Teste com cURL:**
```bash
curl -X POST http://localhost:5678/webhook/a4f5d090-4382-4e89-8f7c-65e942cc935d \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Jaqueta Cargo Oversized",
    "descricao": "Jaqueta em sarja com bolsos utilitários e corte urbano.",
    "categoria": "Jaquetas",
    "preco": 259.90,
    "imagem_url": "https://exemplo.com/imagens/jaqueta-cargo.jpg"
  }'
```

---

## 📁 Estrutura do Repositório

```
.
├── api/
│   ├── app.js               # API de produtos em Node.js/Express
│   ├── db.json              # Base de dados simulada de produtos
│   └── package.json
│
├── fluxos/
│   ├── Cenario_1.json       # Workflow: Boas-Vindas Simples
│   ├── Cenario_2.json       # Workflow: Assistente de Vendas
│   └── Cenario_3.json       # Workflow: Notificação de Lançamento
│
└── README.md
```

---

## 🧠 Conclusão

Este projeto demonstra a flexibilidade do n8n para orquestrar tarefas complexas, criando soluções que integram plataformas de mensageria, bancos de dados e o poder da Inteligência Artificial Generativa para criar experiências de usuário ricas e automatizadas.
