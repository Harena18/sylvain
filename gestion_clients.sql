-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mar. 26 août 2025 à 16:33
-- Version du serveur : 10.11.11-MariaDB-0+deb12u1
-- Version de PHP : 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_clients`
--

-- --------------------------------------------------------

--
-- Structure de la table `Clients`
--

CREATE TABLE `Clients` (
  `id` int(10) UNSIGNED NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Clients`
--

INSERT INTO `Clients` (`id`, `lastname`, `firstname`, `phone`, `email`) VALUES
(1, 'Rasolofoniaina', 'Mintsa Sylvain', '0387334936', 'mintsasylvain.pro@gmail.com'),
(2, 'Tahinasimbola', 'Harena Mitia', '0386245376', '');

-- --------------------------------------------------------

--
-- Structure de la table `Client_Items`
--

CREATE TABLE `Client_Items` (
  `client_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Clothes`
--

CREATE TABLE `Clothes` (
  `item_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Clothes`
--

INSERT INTO `Clothes` (`item_id`, `size`) VALUES
(1, 'L');

-- --------------------------------------------------------

--
-- Structure de la table `Display`
--

CREATE TABLE `Display` (
  `item_id` int(11) NOT NULL,
  `format` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Display`
--

INSERT INTO `Display` (`item_id`, `format`) VALUES
(2, 'A5'),
(9, '');

-- --------------------------------------------------------

--
-- Structure de la table `Items`
--

CREATE TABLE `Items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Clothes','Tarpaulin','Display') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Items`
--

INSERT INTO `Items` (`id`, `name`, `type`, `created_at`) VALUES
(1, 'T-shirt', 'Clothes', '2025-08-26 03:26:54'),
(2, 'Poster', 'Display', '2025-08-26 03:50:40');

-- --------------------------------------------------------

--
-- Structure de la table `Personalisations`
--

CREATE TABLE `Personalisations` (
  `id` int(11) NOT NULL,
  `client_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(11) NOT NULL,
  `motif` varchar(255) NOT NULL,
  `date_debut` datetime NOT NULL DEFAULT current_timestamp(),
  `date_fin` datetime DEFAULT NULL,
  `statut` enum('en cours','terminé','en retard','récupéré','livré') DEFAULT 'en cours',
  `nombre_exemplaires` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Personalisations`
--

INSERT INTO `Personalisations` (`id`, `client_id`, `item_id`, `motif`, `date_debut`, `date_fin`, `statut`, `nombre_exemplaires`) VALUES
(1, 1, 1, 'Etoile', '2025-08-26 06:39:24', '2025-12-12 00:00:00', 'en cours', 1),
(2, 2, 1, 'Pomme', '2025-08-26 06:41:01', '2025-01-01 00:00:00', 'en retard', 1),
(3, 2, 2, 'Paillettes', '2025-08-26 06:51:12', '2026-12-12 00:00:00', 'en cours', 5);

-- --------------------------------------------------------

--
-- Structure de la table `Tarpaulin`
--

CREATE TABLE `Tarpaulin` (
  `item_id` int(11) NOT NULL,
  `length` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Client_Items`
--
ALTER TABLE `Client_Items`
  ADD PRIMARY KEY (`client_id`,`item_id`),
  ADD KEY `fk_item` (`item_id`);

--
-- Index pour la table `Clothes`
--
ALTER TABLE `Clothes`
  ADD PRIMARY KEY (`item_id`);

--
-- Index pour la table `Display`
--
ALTER TABLE `Display`
  ADD PRIMARY KEY (`item_id`);

--
-- Index pour la table `Items`
--
ALTER TABLE `Items`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Personalisations`
--
ALTER TABLE `Personalisations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Index pour la table `Tarpaulin`
--
ALTER TABLE `Tarpaulin`
  ADD PRIMARY KEY (`item_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Items`
--
ALTER TABLE `Items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Personalisations`
--
ALTER TABLE `Personalisations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Client_Items`
--
ALTER TABLE `Client_Items`
  ADD CONSTRAINT `fk_client` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_item` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Clothes`
--
ALTER TABLE `Clothes`
  ADD CONSTRAINT `Clothes_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Display`
--
ALTER TABLE `Display`
  ADD CONSTRAINT `Display_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Personalisations`
--
ALTER TABLE `Personalisations`
  ADD CONSTRAINT `Personalisations_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Clients` (`id`),
  ADD CONSTRAINT `Personalisations_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`);

--
-- Contraintes pour la table `Tarpaulin`
--
ALTER TABLE `Tarpaulin`
  ADD CONSTRAINT `Tarpaulin_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Items` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
