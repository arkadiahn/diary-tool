/*
  Warnings:

  - Added the required column `updateTime` to the `DiaryGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiaryGoal" ADD COLUMN     "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateTime" TIMESTAMP(3) NOT NULL;
