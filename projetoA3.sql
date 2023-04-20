CREATE DATABASE projetoA3;

USE projetoA3;

CREATE TABLE Usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    dataNascimento DATE NOT NULL,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(200) NOT NULL,
    telefone VARCHAR(11),
    endereco VARCHAR(200),
    cidade VARCHAR(30),
    cep VARCHAR(8),
    tipo VARCHAR(9) NOT NULL
);
    
CREATE TABLE Psicologo (
	crp INT PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    usuario_id INT NOT NULL,
    titulacao VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    atendimento VARCHAR(200) NOT NULL,
    valor DOUBLE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Paciente (
	cpf VARCHAR(11) PRIMARY KEY,
    usuario_id INT NOT NULL,
    psicologo_crp INT,
    valorConsulta DOUBLE,
    responsavel VARCHAR(100),
	FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (psicologo_crp) REFERENCES Psicologo(crp)
);

CREATE TABLE Agendamento (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(200) NOT NULL,
    data_hora DATETIME NOT NULL UNIQUE,
    sala VARCHAR(50) NOT NULL,
    paciente_id VARCHAR(11) NOT NULL,
    psicologo_crp INT NOT NULL,
    sessao_id INT DEFAULT NULL,
    arquivada BOOLEAN DEFAULT FALSE,
    motivo VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (paciente_id) REFERENCES Paciente(cpf),
    FOREIGN KEY (psicologo_crp) REFERENCES Psicologo(crp)
);

CREATE TABLE Sessao (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(200) NOT NULL,
    observacoes TEXT,
    notas TEXT,
    agendamento_id INT NOT NULL,
    paciente_id VARCHAR(11) NOT NULL,
    psicologo_id INT NOT NULL,
    FOREIGN KEY (agendamento_id) REFERENCES Agendamento(id),
    FOREIGN KEY (paciente_id) REFERENCES Paciente(cpf),
    FOREIGN KEY (psicologo_id) REFERENCES Psicologo(crp)
);

ALTER TABLE Agendamento
	ADD CONSTRAINT sessao_agendamento
    FOREIGN KEY (sessao_id) REFERENCES Sessao(id);

USE projetoA3;

INSERT INTO Usuario(
	id,
    login,
    senha,
    email,
    dataNascimento,
    nome,
    sobrenome,
    telefone,
    endereco,
    cidade,
    cep,
    tipo) VALUES (
    1,
	'teste',
    '123',
    'bvsilva@hotmail.com',
    '1990-08-29',
    'Fulano',
    'de Tal',
    '11123456789',
    'Rua Qualquer, 1000 - Jardim Nulo',
    'São Paulo - SP',
    '9305178',
    'paciente');
    
INSERT INTO Paciente(cpf, usuario_id) VALUES ('12345678910', 1);
    
INSERT INTO Usuario(
	id,
    login,
    senha,
    email,
    dataNascimento,
    nome,
    sobrenome,
    telefone,
    endereco,
    cidade,
    cep,
    tipo) VALUES (
    2,
	'psico1',
    '123',
    'psico1@projetoa3.com',
    '1986-06-21',
    'Ana Beatriz',
    'Pontes',
    '11123456789',
    'Av. dos Mares, 561 - Alto da Boa Vista',
    'São Paulo - SP',
    '95430861',
    'psicologo');

INSERT INTO Psicologo(crp, cpf, usuario_id, titulacao, especialidade, atendimento, valor) VALUES (
	'123456', 
    '92468130875', 
    2,
    'Graduada em Psicologia',
    'Especialista em Terapia de Casal', 
    'Rua Teste, nº00 - Sala 00',
    200);
    
UPDATE Paciente SET psicologo_crp = 123456, valorConsulta = 200.00 WHERE cpf='12345678910';

INSERT INTO Usuario(
	id,
    login,
    senha,
    email,
    dataNascimento,
    nome,
    sobrenome,
    telefone,
    endereco,
    cidade,
    cep,
    tipo) VALUES (
    3,
	'psico2',
    '123',
    'psico2@projetoa3.com',
    '1975-11-15',
    'Antônio Carlos',
    'Silveira',
    '11956438706',
    'Rua das Rosas, 15 - Vila Alegre',
    'São Paulo - SP',
    '38192756',
    'psicologo');

INSERT INTO Psicologo(crp, cpf, usuario_id, titulacao, especialidade, atendimento, valor) VALUES (
	'297381', 
    '62498050315', 
    3,
    'Graduado em Psicologia',
    'Especialista em Musicoterapia', 
    'Rua das Rosas, 15 - Vila Alegre',
    150);

INSERT INTO Usuario(
	id,
    login,
    senha,
    email,
    dataNascimento,
    nome,
    sobrenome,
    telefone,
    endereco,
    cidade,
    cep,
    tipo) VALUES (
    4,
	'psico3',
    '123',
    'psico3@projetoa3.com',
    '1975-11-15',
    'Rosana',
    'Navarro',
    '1199245454',
    'Av. Libertadores da Ámerica, 2665 - Centro',
    'São Paulo - SP',
    '06698123',
    'psicologo');

INSERT INTO Psicologo(crp, cpf, usuario_id, titulacao, especialidade, atendimento, valor) VALUES (
	'001265', 
    '16794385246', 
    4,
    'Graduada em Psicologia, Mestre em Análise Comportamental',
    'Especialista em Crianças e Adolescentes', 
    'Av. Libertadores da Ámerica, 2665 - Apt. 35',
    250);

INSERT INTO Agendamento (nome, sobrenome, data_hora, sala, paciente_id, psicologo_crp) VALUES (
    'Fulano',
    'de Tal',
    '2022-11-18 15:00:00',
    'Online via Zoom',
    '12345678910',
    123456
);

INSERT INTO Sessao (nome, sobrenome, observacoes, notas, agendamento_id, paciente_id, psicologo_id) VALUES (
    'Fulano',
    'de Tal',
    'Esse texto é visível apenas para o psicologo.',
    'Esse texto é visivel tanto para o paciente como para seu psicologo(a).',
    1,
    '12345678910',
    123456
);

UPDATE Agendamento SET sessao_id = 1 WHERE id = 1;