# Aplicação Multi-Serviços com Frontend, API REST, Tradução e IA

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen)
![Licença](https://img.shields.io/badge/licença-MIT-blue)
![Docker](https://img.shields.io/badge/Docker-20.10.12+-blue)

Uma aplicação completa com stack moderna que integra uma interface web, API REST com persistência de dados, serviço de tradução automatizada e acesso a um modelo de linguagem grande (LLM).

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Serviços](#-serviços)
- [Persistência de Dados](#-persistência-de-dados)
- [Personalizações](#-personalizações)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Contribuições](#-contribuições)
- [Licença](#-licença)

## 🌟 Visão Geral

Este projeto fornece uma infraestrutura completa e pronta para uso que inclui:

- **Frontend**: Interface web servida por Nginx
- **API REST**: JSON Server com persistência de dados
- **Tradução Automática**: Serviço LibreTranslate para tradução entre idiomas
- **Modelo de IA**: Llama2 executado via Ollama para processamento de linguagem natural

Todos os componentes estão configurados em containers Docker e gerenciados via Docker Compose, garantindo uma experiência de instalação simplificada e funcionamento idêntico em qualquer ambiente.

## 🏗 Arquitetura

A aplicação utiliza uma arquitetura de microserviços onde cada componente é isolado em seu próprio container:

```
[Cliente Web] <---> [Nginx (Frontend)] <---> [JSON Server (API)]
                           ↑                        ↑
                           ↓                        ↓
                  [LibreTranslate] <---> [Llama2 (Modelo IA)]
```

## 🛠 Tecnologias

- **Frontend**: Nginx (Alpine), HTML/CSS/JavaScript
- **API**: JSON Server com Node.js
- **Tradução**: LibreTranslate (tradução de código aberto)
- **IA**: Ollama executando o modelo Llama2
- **Infraestrutura**: Docker e Docker Compose

## 📝 Requisitos

- Docker Engine 20.10.12 ou superior
- Docker Compose v2.0.0 ou superior
- Mínimo de 16GB de RAM (recomendado 32GB para melhor performance)
- Mínimo de 20GB de espaço em disco

## 🚀 Instalação e Execução

### Passo 1: Clone o repositório

```bash
git clone https:///github.com/franciscothiago0111/llama2_translator_site.git
cd llama2_translator_site
```

### Passo 2: Inicie os containers

```bash
docker-compose up -d
```

Isso iniciará todos os serviços. O primeiro start pode levar alguns minutos, especialmente enquanto o Llama2 é baixado.

### Passo 3: Verifique o status

```bash
docker-compose ps
```

Todos os serviços devem estar marcados como "Up".

## 📲 Uso

Após iniciar os serviços, você pode acessar:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API REST**: [http://localhost:3001](http://localhost:3001)
  - Exemplos:
    - Listar todos os textos: [http://localhost:3001/texts](http://localhost:3001/texts)
    - Listar todas as palavras: [http://localhost:3001/words](http://localhost:3001/words)
- **LibreTranslate**: [http://localhost:5000](http://localhost:5000)
- **Ollama/Llama2**: Acessível via API em [http://localhost:11434](http://localhost:11434)

## 📁 Estrutura do Projeto

```
projeto/
├── docker-compose.yml          # Configuração dos serviços
├── frontend/                   # Arquivos do frontend
│   ├── index.html              # Página principal
│   ├── nginx.conf              # Configuração do servidor web
│   └── ...                     # Outros arquivos do frontend
├── llama2/                     # Configuração do serviço Llama2
│   ├── Dockerfile              # Imagem customizada para Ollama
│   └── init-llama.sh           # Script de inicialização
└── json-server/                # Configuração do JSON Server
    ├── Dockerfile              # Imagem customizada para json-server
    ├── entrypoint.sh           # Script de inicialização
    ├── default-db.json         # Estrutura inicial do banco de dados
    └── data/                   # Diretório para persistência de dados
        └── .gitkeep            # Arquivo para manter diretório no Git
```

## 🔌 Serviços

### Frontend (Nginx)

Serve a interface web da aplicação. O conteúdo estático é armazenado na pasta `frontend/` e servido pelo Nginx.

- **Porta**: 3000
- **Volumes**:
  - `./frontend:/usr/share/nginx/html`: Arquivos da aplicação web
  - `./frontend/nginx.conf:/etc/nginx/conf.d/default.conf`: Configuração do Nginx

### JSON Server (API REST)

Fornece uma API REST completa com operações CRUD e persistência de dados.

- **Porta**: 3001
- **Volumes**:
  - `./json-server/data:/data`: Armazena os dados persistidos
- **Endpoints**:
  - `GET /posts`: Lista todos os posts
  - `GET /posts/:id`: Obtém um post específico
  - `POST /posts`: Cria um novo post
  - `PUT /posts/:id`: Atualiza um post
  - `DELETE /posts/:id`: Remove um post
  - `GET /comments`: Lista todos os comentários
  - `GET /profile`: Obtém o perfil

### LibreTranslate

Serviço de tradução de código aberto que suporta diversos idiomas.

- **Porta**: 5000
- **Volumes**:
  - `libretranslate_models:/app/nllb`: Volume para armazenar modelos de tradução
- **Idiomas suportados**: Inglês, Português, Espanhol e Francês
- **Uso básico**: Acesse a UI em [http://localhost:5000](http://localhost:5000) ou use a API

### Llama2 (Ollama)

Modelo de linguagem grande (LLM) executado localmente via Ollama.

- **Porta**: 11434
- **Volumes**:
  - `ollama_data:/root/.ollama`: Volume para armazenar modelos de IA
- **Uso básico**:
  - API: `POST http://localhost:11434/api/generate`
  - Corpo da requisição: `{"model": "llama2", "prompt": "Olá, como você está?"}`

## 💾 Persistência de Dados

Todos os serviços foram configurados para garantir persistência de dados entre reinicializações:

### JSON Server

Os dados são armazenados no diretório `./json-server/data/`. O arquivo principal é o `db.json`, que é criado automaticamente na primeira inicialização a partir do modelo `default-db.json`.

Para backup ou migração:
```bash
cp ./json-server/data/db.json ./backup-data.json
```

### LibreTranslate

Os modelos são armazenados em um volume Docker, permitindo que o serviço não precise baixá-los novamente a cada inicialização:
```bash
docker volume inspect libretranslate_models
```

### Llama2/Ollama

O modelo Llama2 e suas configurações são armazenados em um volume Docker:
```bash
docker volume inspect ollama_data
```

## ⚙️ Personalizações

### Modificando o Banco de Dados Padrão

Para alterar a estrutura inicial do banco de dados:

1. Edite o arquivo `json-server/default-db.json`
2. Reconstrua o container:
   ```bash
   docker-compose up -d --build json-server
   ```

### Adicionando mais idiomas ao LibreTranslate

Para suportar mais idiomas:

1. Edite o arquivo `docker-compose.yml` e modifique a variável de ambiente:
   ```yaml
   environment:
     - LT_LOAD_ONLY=en,pt,es,fr,de,it # Adicione os códigos de idioma desejados
   ```
2. Reinicie o serviço:
   ```bash
   docker-compose up -d libretranslate
   ```

### Usando um modelo diferente com Ollama

Para mudar o modelo de IA:

1. Edite o arquivo `llama2/init-llama.sh` e substitua "llama2" pelo modelo desejado
2. Reconstrua o container:
   ```bash
   docker-compose up -d --build llama2
   ```

## 🔧 Troubleshooting

### JSON Server não está persistindo dados

Verifique as permissões do diretório:
```bash
ls -la ./json-server/data/
```

O usuário que executa o Docker deve ter permissão de escrita neste diretório.

### Llama2 não está carregando

O download inicial do modelo pode levar tempo. Verifique os logs:
```bash
docker-compose logs -f llama2
```

### Erros de memória com Llama2

O modelo requer bastante RAM. Aumente a memória disponível para o Docker no seu sistema host.

## ❓ FAQ

### É possível executar em produção?

Esta configuração é primariamente destinada a ambientes de desenvolvimento. Para produção, seriam necessárias configurações adicionais de segurança e escalabilidade.

### Como posso fazer backup dos dados?

Para cada serviço:
- **JSON Server**: Copie `./json-server/data/db.json`
- **LibreTranslate/Llama2**: Faça backup dos volumes Docker

### Como atualizar os serviços?

```bash
git pull                    # Atualiza os arquivos do repositório
docker-compose pull         # Puxa as imagens mais recentes
docker-compose up -d --build # Reconstrói e reinicia os containers
```

## 👥 Contribuições

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ por [Francisco Thiago]

Para suporte ou dúvidas, abra uma [issue](https:///github.com/franciscothiago0111/llama2_translator_site/issues) no GitHub.