FROM ollama/ollama@sha256:50ab2378567a62b811a2967759dd91f254864c3495cbe50576bd8a85bc6edd56

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY init-llama.sh /init-llama.sh
RUN chmod +x /init-llama.sh

ENTRYPOINT ["/init-llama.sh"]
