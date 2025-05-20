-- CreateTable
CREATE TABLE `TaskAd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NULL,
    `schedule` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskAdId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `wage` DOUBLE NOT NULL,
    `detail` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskAdId_fkey` FOREIGN KEY (`taskAdId`) REFERENCES `TaskAd`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
