/*
  Warnings:

  - You are about to drop the column `userId` on the `FileInformation` table. All the data in the column will be lost.
  - You are about to drop the column `fileInformationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileInformation" DROP CONSTRAINT "FileInformation_userId_fkey";

-- AlterTable
ALTER TABLE "FileInformation" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fileInformationId";
