CREATE DATABASE dblogin;

USE dblogin;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INT,
    sexo VARCHAR(20),
    senha VARCHAR(100) NOT NULL,
    cartao VARCHAR(20),
    validade VARCHAR(10),
    cvv VARCHAR(5),
    cpf VARCHAR(20),
    nascimento VARCHAR(20)
);