-- CREATE DATABASE `yasuobank`;
USE `yasuobank`;

DROP TABLE IF EXISTS `associate_banks`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `receivers`;

CREATE TABLE IF NOT EXISTS `users`(
  `id`             BIGINT(20) NOT NULL AUTO_INCREMENT,
  `bank_code`      VARCHAR(255),
  `name`           VARCHAR(255),
  `email`          VARCHAR(255) NOT NULL UNIQUE,
  `password`       VARCHAR(255) NOT NULL,
  `refresh_token`  VARCHAR(255),
  `account_number` VARCHAR(255) NOT NULL UNIQUE,
  `balance`        BIGINT(20) NOT NULL DEFAULT 0,
  `create_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delete_at`      TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_index` (`delete_at`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_roles`(
  `user_id`   BIGINT(20) NOT NULL,
  `role_id`   BIGINT(20) NOT NULL,
  `create_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delete_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `user_roles_index` (`delete_at`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `roles`(
  `id`        BIGINT(20) NOT NULL AUTO_INCREMENT,
  `role`      VARCHAR(255),
  `create_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delete_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `associate_bank_index` (`delete_at`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `associate_banks`(
  `id`         BIGINT(20) NOT NULL AUTO_INCREMENT,
  `bank_code`  VARCHAR(255),
  `name`       VARCHAR(255),
  `private_key`TEXT,
  `public_key` TEXT,
  `secret_key` TEXT,
  `create_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delete_at`  TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `associate_bank_index` (`delete_at`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `receivers`(
  `user_id`                BIGINT(20) NOT NULL,
  `receiver_acount_number` VARCHAR(255) NOT NULL,
  `receiver_name`          VARCHAR(255),
  `bank_code`              VARCHAR(255) NOT NULL DEFAULT 'YSB',
  `create_at`              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_at`              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `delete_at`              TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `receiver_acount_number`),
  KEY `associate_bank_index` (`delete_at`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`role`, `create_at`, `update_at`) VALUES
("customerassociate_banks", NOW(), NOW()),
("staff", NOW(), NOW())
