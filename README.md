# 💻 IA Local com LLaMA 2 + Tradução Offline

Este projeto demonstra como rodar uma inteligência artificial local com LLaMA 2 via Ollama e tradução via LibreTranslate, tudo 100% offline, leve e sem APIs externas.

## ✨ Funcionalidades

- Integração com LLaMA 2 para geração de texto local
- Tradução automática com LibreTranslate
- Interface simples para testes
- Backend leve com JSON Server (simulação de API)
- Tudo roda offline, sem dependências externas

## ⚙️ Requisitos

- Docker
- Node.js (versão 16 ou superior, para JSON Server)
- git (opcional, para clonar o repositório)
- Máquina com pelo menos 16GB de RAM (recomendado para Ollama)
- VS Code com extensão Live Server (para executar a interface HTML)

## 🚀 Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/franciscothiago0111/llama2_translator_site
cd llama2_translator_site
```

2. Baixe as imagens Docker:
```bash
docker pull ollama/ollama
docker pull libretranslate/libretranslate
```

Ou carregue manualmente (se baixado previamente):
```bash
docker load < ollama.tar
docker load < libretranslate.tar
```

3. Suba os containers:
```bash
docker run -d --name ollama -p 11434:11434 ollama/ollama
docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate
```

ℹ️ Certifique-se de que as portas 11434 (Ollama) e 5000 (LibreTranslate) estão liberadas.

4. Instale o JSON Server:
```bash
npm install -g json-server
```

5. Inicie o JSON Server no mesmo diretório do projeto
```bash
json-server --watch db.json
```

6. Abra o arquivo HTML no VS Code e inicie o Live Server:
   - Clique com o botão direito no arquivo HTML
   - Selecione "Open with Live Server"
   - A interface será aberta no seu navegador padrão

## ✅ Vantagens

- 🔒 Privacidade total dos dados
- 🚫 Sem conexão com servidores externos
- 💸 Zero custo com APIs
- ⚡️ Resposta rápida em máquinas compatíveis
- 🧪 Ideal para testes, demos e desenvolvimento

## 📩 Contribua
Abra issues, envie pull requests ou dê feedback: franciscothiago0111@gmail.com

## 🧠 Créditos

- Ollama (LLaMA)
- LibreTranslate
- JSON Server
- VS Code com Live Server