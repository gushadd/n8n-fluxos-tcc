// =================================================================
// 1. IMPORTAÇÕES - Tudo que o projeto precisa
// =================================================================
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

// =================================================================
// 2. CONFIGURAÇÃO INICIAL
// =================================================================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =================================================================
// 3. MIDDLEWARES - Funções que rodam em toda requisição
// =================================================================
app.use(cors());
app.use(express.json());

// =================================================================
// 4. FUNÇÕES AUXILIARES
// =================================================================
async function notificarN8N(novoProduto) {
  // Sua URL do n8n está correta aqui.
  const n8nWebhookUrl = 'https://jedidiah-nonexploratory-betty.ngrok-free.dev/webhook/a4f5d090-4382-4e89-8f7c-65e942cc935d';

  // =================================================
  // ✅ A CORREÇÃO ESTÁ AQUI ✅
  // A verificação agora compara com o texto de placeholder, e não com a sua URL real.
  // Isso fará com que o código continue a execução.
  if (!n8nWebhookUrl || n8nWebhookUrl === 'URL_DO_SEU_WEBHOOK_N8N_AQUI') {
    console.warn("AVISO: A URL do Webhook do n8n não foi configurada. Notificação pulada.");
    return;
  }
  // =================================================

  console.log('Enviando para o n8n:', novoProduto);
  try {
    const config = {
      headers: { 'bypass-ngrok-browser-warning': 'true' }
    };
    await axios.post(n8nWebhookUrl, novoProduto, config);
    console.log('Webhook enviado para o n8n com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar webhook para o n8n:', error.message);
  }
}

// =================================================================
// 5. ENDPOINTS (ROTAS DA API)
// =================================================================

// Endpoint para LER todos os produtos
app.get("/produtos", (req, res) => {
  const filePath = path.join(__dirname, "data", "produtos.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao ler o arquivo de produtos." });
    }
    try {
      const produtos = JSON.parse(data);
      res.json(produtos);
    } catch (parseError) {
      console.error(parseError);
      res.status(500).json({ erro: "Erro ao interpretar os dados dos produtos." });
    }
  });
});

// =================================================================
// ✅ NOVO ENDPOINT ADICIONADO AQUI ✅
// =================================================================
// Endpoint para LER todas as categorias únicas
app.get("/categorias", (req, res) => {
    const filePath = path.join(__dirname, "data", "produtos.json");
  
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao ler o arquivo de produtos." });
      }
      try {
        const produtos = JSON.parse(data);
  
        // 1. Extrai o nome de todas as categorias
        const todasAsCategorias = produtos.map(produto => produto.categoria);
  
        // 2. Cria um array apenas com as categorias únicas
        const categoriasUnicas = [...new Set(todasAsCategorias)];
  
        // 3. Formata a saída para ter um ID e um nome (ótimo para botões)
        const categoriasFormatadas = categoriasUnicas.map((nomeCategoria, index) => {
          return {
            id: index + 1, // Cria um ID sequencial simples
            nome: nomeCategoria
          };
        });
  
        // 4. Envia a lista de categorias como resposta
        res.json(categoriasFormatadas);
  
      } catch (parseError) {
        console.error(parseError);
        res.status(500).json({ erro: "Erro ao interpretar os dados dos produtos." });
      }
    });
  });

// Endpoint para ADICIONAR um novo produto
app.post("/produtos", (req, res) => {
  const novoProduto = req.body;
  const filePath = path.join(__dirname, "data", "produtos.json");

  if (!novoProduto || Object.keys(novoProduto).length === 0) {
      return res.status(400).json({ erro: "Dados do produto não podem ser vazios." });
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo para salvar." });

    const produtos = JSON.parse(data);
    const ultimoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.idProduto)) : 0;
    novoProduto.idProduto = ultimoId + 1;
    produtos.push(novoProduto);

    fs.writeFile(filePath, JSON.stringify(produtos, null, 2), async (writeErr) => {
      if (writeErr) return res.status(500).json({ erro: "Erro ao salvar o novo produto no arquivo." });
      
      await notificarN8N(novoProduto);
      
      res.status(201).json(novoProduto);
    });
  });
});

// =================================================================
// 6. INICIALIZAÇÃO DO SERVIDOR
// =================================================================
app.listen(PORT, () => {
  console.log(`🚀 API rodando com sucesso na porta ${PORT}`);
});