/*
  Warnings:

  - Changed the type of `role` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."Employee_name_key";

-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL;
