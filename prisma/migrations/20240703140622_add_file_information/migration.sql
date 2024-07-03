-- CreateTable
CREATE TABLE "FileInformation" (
    "id" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "serverFileName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FileInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fileInformationId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileInformation" ADD CONSTRAINT "FileInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
