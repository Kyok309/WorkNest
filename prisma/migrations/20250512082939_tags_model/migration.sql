/*
  Warnings:

  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taskad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_taskAdId_fkey`;

-- DropTable
DROP TABLE `task`;

-- DropTable
DROP TABLE `taskad`;

-- CreateTable
CREATE TABLE `EmployeeRole` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(30) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `registerNum` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNum` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `employeeRoleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(30) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `registerNum` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avgRating` DOUBLE NOT NULL,
    `education` VARCHAR(191) NOT NULL,
    `pastExperience` VARCHAR(191) NOT NULL,
    `phoneNum` INTEGER NOT NULL,
    `homeAddress` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(1000) NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Client_email_key`(`email`),
    INDEX `Client_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `imageURL` VARCHAR(191) NOT NULL,
    `experienceYear` DOUBLE NOT NULL,
    `wageType` VARCHAR(191) NULL,
    `wage` DOUBLE NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `subcategoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceComment` (
    `id` VARCHAR(30) NOT NULL,
    `comment` VARCHAR(1000) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `commentWriterId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdState` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ad` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `totalWage` DOUBLE NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `adStateId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdCategory` (
    `id` VARCHAR(30) NOT NULL,
    `adId` VARCHAR(191) NOT NULL,
    `subCategoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdComment` (
    `id` VARCHAR(30) NOT NULL,
    `comment` VARCHAR(1000) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `commentWriterId` VARCHAR(191) NOT NULL,
    `adId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdJobState` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdJob` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `vacancy` INTEGER NOT NULL,
    `isExperienceRequired` BOOLEAN NOT NULL,
    `wage` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `adJobStateId` VARCHAR(191) NOT NULL,
    `adId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobRequest` (
    `id` VARCHAR(30) NOT NULL,
    `adJobId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestStateRef` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestState` (
    `id` VARCHAR(30) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jobRequestId` VARCHAR(191) NOT NULL,
    `requestStateRefId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatingType` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatingCategory` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobRating` (
    `id` VARCHAR(30) NOT NULL,
    `rating` INTEGER NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `jobRequestId` VARCHAR(191) NOT NULL,
    `ratingTypeId` VARCHAR(191) NOT NULL,
    `ratingCategoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Escrow` (
    `id` VARCHAR(30) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `state` VARCHAR(30) NOT NULL,
    `modifiedDate` DATETIME(3) NOT NULL,
    `adJobId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentType` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(30) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `escrowId` VARCHAR(191) NOT NULL,
    `jobOrdererId` VARCHAR(191) NOT NULL,
    `contractorId` VARCHAR(191) NOT NULL,
    `jobRequestId` VARCHAR(191) NOT NULL,
    `paymentTypeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_employeeRoleId_fkey` FOREIGN KEY (`employeeRoleId`) REFERENCES `EmployeeRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceComment` ADD CONSTRAINT `ServiceComment_commentWriterId_fkey` FOREIGN KEY (`commentWriterId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceComment` ADD CONSTRAINT `ServiceComment_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ad` ADD CONSTRAINT `Ad_adStateId_fkey` FOREIGN KEY (`adStateId`) REFERENCES `AdState`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ad` ADD CONSTRAINT `Ad_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdCategory` ADD CONSTRAINT `AdCategory_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdCategory` ADD CONSTRAINT `AdCategory_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdComment` ADD CONSTRAINT `AdComment_commentWriterId_fkey` FOREIGN KEY (`commentWriterId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdComment` ADD CONSTRAINT `AdComment_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdJob` ADD CONSTRAINT `AdJob_adJobStateId_fkey` FOREIGN KEY (`adJobStateId`) REFERENCES `AdJobState`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdJob` ADD CONSTRAINT `AdJob_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobRequest` ADD CONSTRAINT `JobRequest_adJobId_fkey` FOREIGN KEY (`adJobId`) REFERENCES `AdJob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobRequest` ADD CONSTRAINT `JobRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestState` ADD CONSTRAINT `RequestState_jobRequestId_fkey` FOREIGN KEY (`jobRequestId`) REFERENCES `JobRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestState` ADD CONSTRAINT `RequestState_requestStateRefId_fkey` FOREIGN KEY (`requestStateRefId`) REFERENCES `RequestStateRef`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobRating` ADD CONSTRAINT `JobRating_jobRequestId_fkey` FOREIGN KEY (`jobRequestId`) REFERENCES `JobRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobRating` ADD CONSTRAINT `JobRating_ratingTypeId_fkey` FOREIGN KEY (`ratingTypeId`) REFERENCES `RatingType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobRating` ADD CONSTRAINT `JobRating_ratingCategoryId_fkey` FOREIGN KEY (`ratingCategoryId`) REFERENCES `RatingCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Escrow` ADD CONSTRAINT `Escrow_adJobId_fkey` FOREIGN KEY (`adJobId`) REFERENCES `AdJob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_escrowId_fkey` FOREIGN KEY (`escrowId`) REFERENCES `Escrow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_jobOrdererId_fkey` FOREIGN KEY (`jobOrdererId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_contractorId_fkey` FOREIGN KEY (`contractorId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_jobRequestId_fkey` FOREIGN KEY (`jobRequestId`) REFERENCES `JobRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `PaymentType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
