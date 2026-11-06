-- Banco de dados PetShop Minac
CREATE TABLE usuario (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  cep CHAR(8) NOT NULL,
  endereco VARCHAR(200) NOT NULL
);

CREATE TABLE produto (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  categoria VARCHAR(40) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  descricao VARCHAR(255),
  imagem VARCHAR(255),
  estoque INTEGER NOT NULL DEFAULT 0,
  destaque BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cupom (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  desconto_percentual DECIMAL(5,2) NOT NULL,
  validade DATE NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE pedido (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  id_usuario INTEGER NOT NULL,
  data_pedido DATETIME NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  frete DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(10) NOT NULL, -- cartao, pix ou boleto
  status VARCHAR(20) NOT NULL DEFAULT 'Aguardando pagamento',
  FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE item_pedido (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id),
  FOREIGN KEY (id_produto) REFERENCES produto(id)
);

INSERT INTO cupom (codigo, desconto_percentual, validade) VALUES
('MINAC10', 10.00, '2026-12-31'),
('BEMVINDO5', 5.00, '2026-12-31');

INSERT INTO produto (nome, categoria, preco, descricao, imagem, estoque, destaque) VALUES
('Ração Seca Cães Adultos Frango 10kg','Ração',139.9,'Ração completa para cães adultos, sabor frango e arroz.','https://placehold.co/400x400?text=Produto+1',23,TRUE),
('Ração Seca Cães Filhotes 3kg','Ração',64.9,'Ração para filhotes com DHA para o desenvolvimento.','https://placehold.co/400x400?text=Produto+2',26,FALSE),
('Ração Seca Gatos Adultos Salmão 3kg','Ração',72.5,'Ração para gatos adultos castrados, sabor salmão.','https://placehold.co/400x400?text=Produto+3',29,TRUE),
('Ração Úmida Sachê Gatos 85g','Ração',3.99,'Sachê de alimento úmido para gatos, sabor carne.','https://placehold.co/400x400?text=Produto+4',32,FALSE),
('Petisco Bifinho Cães 500g','Petiscos',24.9,'Petisco macio sabor carne para cães de todos os portes.','https://placehold.co/400x400?text=Produto+5',35,FALSE),
('Osso de Couro Cães','Petiscos',9.9,'Osso de couro prensado para roer e limpar os dentes.','https://placehold.co/400x400?text=Produto+6',38,FALSE),
('Bolinha de Borracha com Apito','Brinquedos',14.9,'Bolinha resistente para brincar de buscar.','https://placehold.co/400x400?text=Produto+7',41,TRUE),
('Corda de Algodão para Cães','Brinquedos',19.9,'Brinquedo de corda para cabo de guerra.','https://placehold.co/400x400?text=Produto+8',44,FALSE),
('Arranhador para Gatos Torre','Brinquedos',129.0,'Torre arranhador com plataforma e bolinha.','https://placehold.co/400x400?text=Produto+9',47,FALSE),
('Varinha com Penas para Gatos','Brinquedos',12.9,'Brinquedo interativo com penas coloridas.','https://placehold.co/400x400?text=Produto+10',50,FALSE),
('Coleira Nylon Ajustável M','Acessórios',29.9,'Coleira de nylon ajustável, tamanho médio.','https://placehold.co/400x400?text=Produto+11',53,FALSE),
('Peitoral com Guia P','Acessórios',49.9,'Peitoral acolchoado com guia, tamanho pequeno.','https://placehold.co/400x400?text=Produto+12',56,TRUE),
('Comedouro Inox Antiderrapante','Acessórios',22.9,'Comedouro de aço inox com base de borracha.','https://placehold.co/400x400?text=Produto+13',59,FALSE),
('Bebedouro Fonte Automático 2L','Acessórios',99.9,'Fonte de água circulante para cães e gatos.','https://placehold.co/400x400?text=Produto+14',62,FALSE),
('Caminha Pet Confort M','Camas',89.9,'Caminha macia e lavável para cães e gatos.','https://placehold.co/400x400?text=Produto+15',65,TRUE),
('Caixa de Transporte N3','Transporte',119.9,'Caixa de transporte resistente com trava de segurança.','https://placehold.co/400x400?text=Produto+16',68,FALSE),
('Areia Higiênica Gatos 4kg','Higiene',21.9,'Areia sanitária com controle de odor.','https://placehold.co/400x400?text=Produto+17',71,FALSE),
('Shampoo Neutro Pet 500ml','Higiene',27.9,'Shampoo neutro para banho de cães e gatos.','https://placehold.co/400x400?text=Produto+18',74,FALSE),
('Tapete Higiênico 30 unidades','Higiene',54.9,'Tapete absorvente para treinar cães.','https://placehold.co/400x400?text=Produto+19',77,FALSE),
('Antipulgas Cães 10 a 25kg','Saúde',79.9,'Comprimido antipulgas e carrapatos de uso mensal.','https://placehold.co/400x400?text=Produto+20',80,FALSE);
