-- CreateTable
CREATE TABLE "FeedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "source" TEXT NOT NULL,
    "price" REAL,
    "tags" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "summary" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserSavedItem" (
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "itemId"),
    CONSTRAINT "UserSavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSavedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "FeedItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedItem_url_key" ON "FeedItem"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserSavedItem_itemId_idx" ON "UserSavedItem"("itemId");

-- CreateIndex
CREATE INDEX "UserSavedItem_userId_idx" ON "UserSavedItem"("userId");
