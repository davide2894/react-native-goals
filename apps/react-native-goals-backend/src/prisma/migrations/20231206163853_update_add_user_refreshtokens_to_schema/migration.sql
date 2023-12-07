-- CreateTable
CREATE TABLE "Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "minScore" INTEGER NOT NULL,
    "actualScore" INTEGER NOT NULL,
    "userIdRef" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    CONSTRAINT "Goal_userIdRef_fkey" FOREIGN KEY ("userIdRef") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userIdRef" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "RefreshToken_userIdRef_fkey" FOREIGN KEY ("userIdRef") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
