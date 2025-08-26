-- phpMyAdmin SQL Dump corrigé
-- version 5.2.1deb1+deb12u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Création et sélection de la base
CREATE DATABASE IF NOT EXISTS `gestion_clients` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gestion_clients`;

-- Table Clients
CREATE TABLE `Clients` (
  `id` int(10) UNSIGNED NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Clients` (`id`, `lastname`, `firstname`, `phone`, `email`) VALUES
(1, 'Rasolofoniaina', 'Mintsa Sylvain', '0387334936', 'mintsasylvain.pro@gmail.com'),
(2, 'Tahinasimbola', 'Harena Mitia', '0386245376', NULL);

-- Table Items
CREATE TABLE `Items` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Clothes','Tarpaulin','Display') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Items` (`id`, `name`, `type`, `created_at`) VALUES
(1, 'T-shirt', 'Clothes', '2025-08-26 03:26:54'),
(2, 'Poster', 'Display', '2025-08-26 03:50:40');

-- Table Client_Items
CREATE TABLE `Client_Items` (
  `client_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table Clothes
CREATE TABLE `Clothes` (
  `item_id` int(11) UNSIGNED NOT NULL,
  `size` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Clothes` (`item_id`, `size`) VALUES
(1, 'L');

-- Table Display
CREATE TABLE `Display` (
  `item_id` int(11) UNSIGNED NOT NULL,
  `format` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Display` (`item_id`, `format`) VALUES
(2, 'A5');

-- Table Personalisations
CREATE TABLE `Personalisations` (
  `id` int(11) UNSIGNED NOT NULL,
  `client_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(11) UNSIGNED NOT NULL,
  `motif` varchar(255) NOT NULL,
  `date_debut` datetime NOT NULL DEFAULT current_timestamp(),
  `date_fin` datetime DEFAULT NULL,
  `statut` enum('en cours','terminé','en retard','récupéré','livré') DEFAULT 'en cours',
  `nombre_exemplaires` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Personalisations` (`id`, `client_id`, `item_id`, `motif`, `date_debut`, `date_fin`, `statut`, `nombre_exemplaires`) VALUES
(1, 1, 1, 'Etoile', '2025-08-26 06:39:24', '2025-12-12 00:00:00', 'en cours', 1),
(2, 2, 1, 'Pomme', '2025-08-26 06:41:01', '2025-01-01 00:00:00', 'en retard', 1),
(3, 2, 2, 'Paillettes', '2025-08-26 06:51:12', '2026-12-12 00:00:00', 'en cours', 5);

-- Table Tarpaulin
CREATE TABLE `Tarpaulin` (
  `item_id` int(11) UNSIGNED NOT NULL,
  `length` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Index
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `Client_Items`
  ADD PRIMARY KEY (`client_id`,`item_id`),
  ADD KEY `fk_item` (`item_id`);

ALTER TABLE `Clothes`
  ADD PRIMARY KEY (`item_id`);

ALTER TABLE `Display`
  ADD PRIMARY KEY (`item_id`);

ALTER TABLE `Items`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `Personalisations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `item_id` (`item_id`);

ALTER TABLE `Tarpaulin`
  ADD PRIMARY KEY (`item_id`);

-- Auto increment
ALTER TABLE `Clients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `Items`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `Personalisations`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- Contraintes
ALTER TABLE `Client_Items`
  ADD CONSTRAINT `fk_client` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_item` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

ALTER TABLE `Clothes`
  ADD CONSTRAINT `Clothes_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

ALTER TABLE `Display`
  ADD CONSTRAINT `Display_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

ALTER TABLE `Personalisations`
  ADD CONSTRAINT `Personalisations_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`),
  ADD CONSTRAINT `Personalisations_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`);

ALTER TABLE `Tarpaulin`
  ADD CONSTRAINT `Tarpaulin_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

COMMIT;
