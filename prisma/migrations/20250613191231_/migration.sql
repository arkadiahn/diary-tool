-- CreateTable
CREATE TABLE "Diary" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL,
    "project" VARCHAR(255) NOT NULL,
    "completionWeeks" INTEGER NOT NULL,
    "motivation" INTEGER NOT NULL,
    "learnings" VARCHAR(6000) NOT NULL,
    "obstacles" VARCHAR(6000) NOT NULL,
    "editableDiary" BOOLEAN NOT NULL DEFAULT false,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "editableGoalCompletion" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryGoal" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "diaryId" TEXT NOT NULL,

    CONSTRAINT "DiaryGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiaryGoal" ADD CONSTRAINT "DiaryGoal_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
