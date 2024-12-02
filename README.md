KoopereApp
Este repositório contém uma aplicação Node.js configurada para ser executada em um ambiente Docker. Abaixo estão as instruções para configurar e executar o projeto.

Pré-requisitos
Certifique-se de que as seguintes ferramentas estão instaladas no seu ambiente:

Node.js
Docker
Docker Compose
Como executar o projeto
1. Instalar as dependências
bash
Copiar código
npm install  
2. Construir a imagem Docker
Execute o comando para criar a imagem do Docker com o nome my-node-app:

bash
Copiar código
docker build -t my-node-app .  
3. Subir os serviços com Docker Compose
Ative os serviços utilizando o Docker Compose:

bash
Copiar código
docker-compose up  
Configuração do banco de dados
Criar as tabelas
A aplicação inclui uma rota para configurar automaticamente as tabelas necessárias no banco de dados. Após a aplicação estar em execução, acesse a seguinte rota:

Método: GET
Rota: /setup

Exemplo de acesso:

bash
Copiar código
http://localhost:3000/setup  
Testando o aplicativo
Após a configuração, o aplicativo estará pronto para ser testado. Utilize ferramentas como Postman ou Insomnia para validar as rotas e o funcionamento.
