DROP DATABASE IF EXISTS fit_memorygame_v2;
CREATE DATABASE IF NOT EXISTS fit_memorygame_v2;
USE fit_memorygame_v2;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `student_id` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_ufc_student` BOOLEAN DEFAULT FALSE,
  `avatar_url` VARCHAR(255) DEFAULT 'default_avatar.png',
  `score` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `cards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL
);

INSERT INTO `cards` (name, image_url) VALUES
('Card 1', '/assets/image/cards/card-1.jpeg'),
('Card 2', '/assets/image/cards/card-2.jpeg'),
('Card 3', '/assets/image/cards/card-3.jpeg'),
('Card 4', '/assets/image/cards/card-4.jpeg'),
('Card 5', '/assets/image/cards/card-5.jpeg'),
('Card 6', '/assets/image/cards/card-6.jpeg'),
('Card 7', '/assets/image/cards/card-7.jpeg'),
('Card 8', '/assets/image/cards/card-8.jpeg'),
('Card 9', '/assets/image/cards/card-9.jpeg'),
('Card 10', '/assets/image/cards/card-10.jpeg'),
('Card 11', '/assets/image/cards/card-11.jpeg'),
('Card 12', '/assets/image/cards/card-12.jpeg');


CREATE TABLE `game_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `score` INT NOT NULL,
  `time` INT NOT NULL,
  `difficulty` VARCHAR(50) NOT NULL,
  `played_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);