#!/bin/sh

# Verifica se o arquivo db.json existe
if [ ! -f "/data/db.json" ]; then
  echo "Criando arquivo db.json a partir do modelo padrão..."
  cp /default-db.json /data/db.json
fi

# Garantir que o usuário node tenha permissão de escrita
chown node:node /data/db.json
chmod 666 /data/db.json

echo "Iniciando json-server..."
echo "Os dados estão sendo persistidos em /data/db.json"
exec json-server --host 0.0.0.0 --watch /data/db.json --port 80