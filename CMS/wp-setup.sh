#!/bin/bash

# Aguardar o MySQL estar pronto
echo "Esperando o MySQL iniciar..."
while ! mysqladmin ping -h"$WORDPRESS_DB_HOST" --silent; do
    sleep 1
done
echo "MySQL está pronto!"

# Instalar o WP-CLI
if ! [ -x "$(command -v wp)" ]; then
    echo "Instalando o WP-CLI..."
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp
fi

# Verificar se o WordPress já está instalado
if ! wp core is-installed --allow-root; then
    echo "Instalando o WordPress..."
    
    # Baixar o WordPress
    wp core download --allow-root

    # Criar o arquivo wp-config.php
    wp config create --dbname=$WORDPRESS_DB_NAME --dbuser=$WORDPRESS_DB_USER --dbpass=$WORDPRESS_DB_PASSWORD --dbhost=$WORDPRESS_DB_HOST --allow-root

    # Instalar o WordPress
    wp core install --url="http://localhost:8000" --title="Blog de Apostas e Futebol" --admin_user="admin" --admin_password="admin" --admin_email="admin@example.com" --allow-root

    echo "WordPress instalado com sucesso!"

    # Criar 10 posts sobre apostas e futebol
    echo "Criando posts de exemplo sobre apostas e futebol..."

    wp post create --post_title="Dicas para Apostar em Jogos de Futebol" --post_content="Neste post, vamos discutir as melhores estratégias para apostar em jogos de futebol e maximizar seus ganhos." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Como Escolher um Site de Apostas Confiável" --post_content="Saiba como escolher um site de apostas seguro e confiável para garantir uma boa experiência ao apostar em futebol." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="O que São Odds e Como Funcionam nas Apostas de Futebol?" --post_content="Entenda o conceito de odds e como elas influenciam suas apostas em partidas de futebol." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Melhores Mercados de Apostas no Futebol" --post_content="Descubra os mercados de apostas mais populares e lucrativos no futebol, como handicap, over/under e outros." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Apostando ao Vivo: Dicas e Estratégias" --post_content="Apostar ao vivo é emocionante, mas exige estratégia. Veja nossas dicas para aproveitar ao máximo as apostas ao vivo em futebol." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Gestão de Banca nas Apostas de Futebol" --post_content="Saiba como gerenciar sua banca de apostas de forma eficiente para minimizar riscos e aumentar seus ganhos." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Erros Comuns nas Apostas de Futebol e Como Evitá-los" --post_content="Evite os erros mais comuns cometidos por apostadores iniciantes e melhore suas chances de sucesso." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Como Analisar Estatísticas Antes de Apostar" --post_content="A análise de estatísticas é fundamental para fazer boas apostas. Aprenda a interpretar dados e tomar decisões informadas." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="Dicas de Apostas para Grandes Competições de Futebol" --post_content="Veja nossas dicas de apostas para grandes competições de futebol, como a Liga dos Campeões, Copa do Mundo e campeonatos nacionais." --post_status="publish" --post_author="1" --allow-root
    wp post create --post_title="A Importância de Manter o Controle Emocional nas Apostas" --post_content="O controle emocional é chave para o sucesso nas apostas. Saiba como manter a calma e apostar de forma racional." --post_status="publish" --post_author="1" --allow-root

    echo "Posts criados com sucesso!"
else
    echo "O WordPress já está instalado."
fi

# Executar o Apache em segundo plano
apache2-foreground
