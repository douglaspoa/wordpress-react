Requisitos 
Docker 


# Passo 1 

Executar o comando 
``
docker-compose up -d 
``

Aguardar até o arquivo wp-setup.sh rodar, você pode verificar nos logs do container do wordpress 

# Passo 2 

Para acessar o admin do wp utilize http://localhost:8000/wp-admin
Para a API REST funcionar ir até Settings > Permalinks e modificar o "permalink structure" de plain para post name

# Passo 3 

Para acessar o front acesse  http://localhost:3000/
