CREATE DATABASE Pimeclothes;

USE Pimeclothes;

CREATE TABLE productos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    talla VARCHAR(10) NOT NULL,
    imagen VARCHAR(150),
);

SELECT * FROM productos;