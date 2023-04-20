# Projeto A3 2022.2

Esse projeto faz parte da avaliação A3 das UCs de Sistemas Distribuídos
e Usabilidade, Desenvolvimento Web, Mobile e Jogos da unidade Jabaquara.

## Tema

Sistema de agendamento de sessões para uma clínica psicológica.

Link do vídeo de apresentação: [Youtube](https://www.youtube.com/watch?v=cAg2qTX57lU), [Google Drive](https://drive.google.com/file/d/1IKQtJVK6zVTCPIxwtz_3zjezdfiFEB0m/view)
## Membros do grupo

- Bruno Venâncio de Souza e Silva - RA: 821135934
- Henrick Melo Vital - RA: 821224905
- Matheus Alves Navarrete Tolomei - RA: 821138944
- Matheus de Souza Calou - RA: 821131367
## Funcionalidades a serem implementadas

- [X] Cadastro de usuários
- [X] Agendamento de sessões
- [X] Inserção de notas da sessão
- [X] Visualização de notas da sessão
- [X] Persistência de dados (MySQL/MariaDB)
- [X] Histórico de sessões
- [X] Observações visíveis apenas para psicólogos
- [X] Tela de login
## Instalação

Para rodar o projeto, é necessário os seguintes programas instalados.

`Node JS (versão 14.20.1)`
`MySQL 8.30`
`Um navegador web de sua preferência (Chrome, Firefox, etc.)`
`Git`

Com esses programas instalados, abra um terminal e clone o projeto:
```
git clone https://github.com/d4rkwav3/projetoA3.git
```
Na raiz desse projeto (pasta `projetoA3`) e instale as dependências do projeto, executando o 
comando abaixo (caso ocorra algum erro, execute o terminal como administrador):

```bash
npm install
```
Também é necessário instalar a versão do Angular usada no projeto, diferente
dos outros pacotes, o Angular precisa ser instalado globalmente, portanto
execute o comando abaixo:

```bash
npm install -g @algular/cli
```
Finalmente, é necessário configurar a base de dados no MySQL, execute o script 
'projetoA3.sql' para criar a base de dados (usando o MySQL Workbench por exemplo),
e por último, altere o arquivo config.mjs na raiz do projeto para o usuário do seu
MySQL:

```
export const config = {
    portas: {
        agendamento: 9100, 
        sessao: 9200,
        usuarios: 9300,
        eventos: 9900
    },
    database: {
        host: "localhost", //não altere
        user: "seu nome de usuário do mysql", //por ex. "root"
        password: "a senha desse usuário",
        database: "projetoA3" //não altere
    }
};
```
## Executando o projeto

Com todas as dependências do projeto instaladas, abra 5 janelas de terminal (cmd, 
powershell, bash, zsh, etc.) e para cada janela navegue até as pastas abaixo 
(uma dessas pastas por janela de terminal):

`
projetoA3/backend/agendamento
`
`
projetoA3/backend/eventos
`
`
projetoA3/backend/sessao
`
`
projetoA3/backend/usuarios
`
`
projetoA3/
`

Nos terminais das pastas agendamento, eventos, sessao e usuarios, execute o comando
abaixo para iniciar os microsserviços:

```
npm start
```

Na janela restante, na raiz do projeto, execute o comando abaixo:
```
ng serve -o
```

Esse último comando irá abrir uma nova aba no navegador com o projeto em execução.

## Executando o projeto

O arquivo `projetoA3.sql` cria algums usuários para fins de teste, são eles:

```
Paciente
    login: teste

Psicologos
    logins: psico1, psico2 e psico3
```

A senha para todos é '123' (sem as aspas).
