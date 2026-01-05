-- DropIndex
DROP INDEX "LabTest_recordId_key";

-- DropIndex
DROP INDEX "LabTest_serviceId_key";

-- CreateIndex
CREATE INDEX "LabTest_serviceId_idx" ON "LabTest"("serviceId");
