FROM wordpress:latest
RUN apt-get update && apt-get install -y less mariadb-client && rm -rf /var/lib/apt/lists/*
COPY wp-setup.sh /usr/local/bin/wp-setup.sh
RUN chmod +x /usr/local/bin/wp-setup.sh

ENTRYPOINT ["/usr/local/bin/wp-setup.sh"]
