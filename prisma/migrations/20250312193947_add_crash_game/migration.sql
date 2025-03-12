-- CreateTable
CREATE TABLE "CrashGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crashPoint" REAL NOT NULL,
    "seed" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CrashBet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "cashoutMultiplier" REAL,
    "autoWithdrawAt" REAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "profit" REAL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CrashBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CrashBet_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "CrashGame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
