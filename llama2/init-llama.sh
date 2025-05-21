#!/bin/sh

/bin/ollama serve &

# Dá um tempo para o servidor iniciar
sleep 10

# Loop para puxar o modelo e esperar até conseguir (status 200)
until curl -X POST http://localhost:11434/api/pull -d '{"name": "llama2"}'; do
  echo "Modelo ainda não disponível, tentando novamente em 5s..."
  sleep 5
done

wait
