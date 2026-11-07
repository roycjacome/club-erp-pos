CREATE TABLE `cancelaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`socioId` int NOT NULL,
	`reservacionId` int NOT NULL,
	`horasAnticipacion` decimal(5,2) NOT NULL,
	`penalizada` boolean NOT NULL DEFAULT false,
	`reembolsado` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cancelaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `canchas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`numero` int NOT NULL,
	`tipo` enum('cemento','arcilla','hierba_sintetica') NOT NULL DEFAULT 'cemento',
	`estado` enum('disponible','ocupada','mantenimiento') NOT NULL DEFAULT 'disponible',
	`capacidad` int NOT NULL DEFAULT 4,
	`iluminacion` boolean NOT NULL DEFAULT true,
	`precioHora` decimal(10,2) NOT NULL,
	`precioHoraLuz` decimal(10,2),
	`ultimoMantenimiento` date,
	`proximoMantenimiento` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canchas_id` PRIMARY KEY(`id`),
	CONSTRAINT `canchas_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `clases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canchaId` int NOT NULL,
	`instructorNombre` varchar(200) NOT NULL,
	`fecha` date NOT NULL,
	`horaInicio` time NOT NULL,
	`horaFin` time NOT NULL,
	`tipoClase` enum('principiante','intermedio','avanzado','grupal','privada') NOT NULL DEFAULT 'grupal',
	`capacidadMaxima` int NOT NULL DEFAULT 8,
	`inscritos` int NOT NULL DEFAULT 0,
	`precio` decimal(10,2) NOT NULL,
	`estadoC` enum('programada','cancelada','completada') NOT NULL DEFAULT 'programada',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inscripciones_torneo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`torneoId` int NOT NULL,
	`socioId` int NOT NULL,
	`companeroId` int,
	`estadoI` enum('inscrito','confirmado','eliminado','ganador') NOT NULL DEFAULT 'inscrito',
	`fechaInscripcion` timestamp NOT NULL DEFAULT (now()),
	`pagado` boolean NOT NULL DEFAULT false,
	CONSTRAINT `inscripciones_torneo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`socioId` int NOT NULL,
	`reservacionId` int,
	`torneoId` int,
	`concepto` varchar(200) NOT NULL,
	`monto` decimal(10,2) NOT NULL,
	`metodo` enum('tarjeta','efectivo','cargo_cuenta','stripe','mercado_pago','apple_pay') NOT NULL DEFAULT 'tarjeta',
	`estadoP` enum('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
	`stripePaymentId` varchar(255),
	`referencia` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pagos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partidos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservacionId` int,
	`canchaId` int NOT NULL,
	`fecha` date NOT NULL,
	`equipo1` text NOT NULL,
	`equipo2` text NOT NULL,
	`marcadorEquipo1` varchar(50),
	`marcadorEquipo2` varchar(50),
	`ganador` enum('equipo1','equipo2','empate'),
	`estado` enum('programado','en_curso','finalizado','cancelado') NOT NULL DEFAULT 'programado',
	`tipo` enum('amistoso','torneo','reta','clase') NOT NULL DEFAULT 'amistoso',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partidos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ranking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`socioId` int NOT NULL,
	`puntos` int NOT NULL DEFAULT 0,
	`categoria` enum('principiante','intermedio','avanzado','profesional') NOT NULL DEFAULT 'principiante',
	`partidosJugados` int NOT NULL DEFAULT 0,
	`victorias` int NOT NULL DEFAULT 0,
	`derrotas` int NOT NULL DEFAULT 0,
	`rachaActual` int NOT NULL DEFAULT 0,
	`mejorRacha` int NOT NULL DEFAULT 0,
	`posicion` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ranking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canchaId` int NOT NULL,
	`socioId` int NOT NULL,
	`fecha` date NOT NULL,
	`horaInicio` time NOT NULL,
	`horaFin` time NOT NULL,
	`estado` enum('confirmada','pendiente','cancelada','completada','no_show') NOT NULL DEFAULT 'pendiente',
	`tipoPago` enum('cargo_cuenta','efectivo','tarjeta','stripe','mercado_pago') NOT NULL DEFAULT 'tarjeta',
	`monto` decimal(10,2) NOT NULL,
	`jugadores` text,
	`notas` text,
	`canceladoEn` timestamp,
	`motivoCancelacion` text,
	`confirmadoAsistencia` boolean DEFAULT false,
	`qrCode` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`nombre` varchar(200) NOT NULL,
	`email` varchar(320),
	`telefono` varchar(20),
	`tipoMembresia` enum('platino','oro','diferida','familiar') NOT NULL DEFAULT 'oro',
	`estado` enum('activa','suspendida','cancelada') NOT NULL DEFAULT 'activa',
	`categoriaPadel` enum('principiante','intermedio','avanzado','profesional') DEFAULT 'principiante',
	`numeroSocio` varchar(20),
	`fechaAlta` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socios_id` PRIMARY KEY(`id`),
	CONSTRAINT `socios_numeroSocio_unique` UNIQUE(`numeroSocio`)
);
--> statement-breakpoint
CREATE TABLE `torneos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(200) NOT NULL,
	`descripcion` text,
	`fechaInicio` date NOT NULL,
	`fechaFin` date,
	`tipo` enum('singles','dobles','mixto','americano','round_robin') NOT NULL DEFAULT 'dobles',
	`categoriaT` enum('principiante','intermedio','avanzado','abierto') NOT NULL DEFAULT 'abierto',
	`maxParticipantes` int NOT NULL DEFAULT 16,
	`inscripcionesActuales` int NOT NULL DEFAULT 0,
	`costoInscripcion` decimal(10,2),
	`premio` text,
	`estadoT` enum('proximo','inscripciones_abiertas','en_curso','finalizado','cancelado') NOT NULL DEFAULT 'proximo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `torneos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cancelaciones` ADD CONSTRAINT `cancelaciones_socioId_socios_id_fk` FOREIGN KEY (`socioId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cancelaciones` ADD CONSTRAINT `cancelaciones_reservacionId_reservaciones_id_fk` FOREIGN KEY (`reservacionId`) REFERENCES `reservaciones`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clases` ADD CONSTRAINT `clases_canchaId_canchas_id_fk` FOREIGN KEY (`canchaId`) REFERENCES `canchas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inscripciones_torneo` ADD CONSTRAINT `inscripciones_torneo_torneoId_torneos_id_fk` FOREIGN KEY (`torneoId`) REFERENCES `torneos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inscripciones_torneo` ADD CONSTRAINT `inscripciones_torneo_socioId_socios_id_fk` FOREIGN KEY (`socioId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inscripciones_torneo` ADD CONSTRAINT `inscripciones_torneo_companeroId_socios_id_fk` FOREIGN KEY (`companeroId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_socioId_socios_id_fk` FOREIGN KEY (`socioId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_reservacionId_reservaciones_id_fk` FOREIGN KEY (`reservacionId`) REFERENCES `reservaciones`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_torneoId_torneos_id_fk` FOREIGN KEY (`torneoId`) REFERENCES `torneos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partidos` ADD CONSTRAINT `partidos_reservacionId_reservaciones_id_fk` FOREIGN KEY (`reservacionId`) REFERENCES `reservaciones`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partidos` ADD CONSTRAINT `partidos_canchaId_canchas_id_fk` FOREIGN KEY (`canchaId`) REFERENCES `canchas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ranking` ADD CONSTRAINT `ranking_socioId_socios_id_fk` FOREIGN KEY (`socioId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservaciones` ADD CONSTRAINT `reservaciones_canchaId_canchas_id_fk` FOREIGN KEY (`canchaId`) REFERENCES `canchas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservaciones` ADD CONSTRAINT `reservaciones_socioId_socios_id_fk` FOREIGN KEY (`socioId`) REFERENCES `socios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `socios` ADD CONSTRAINT `socios_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;