-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DORMANT');

-- CreateEnum
CREATE TYPE "JOBTYPE" AS ENUM ('FULL', 'PART');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'MOBILE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIAL', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('CONSULTATION', 'LAB_TEST', 'VACCINATION', 'PROCEDURE', 'PHARMACY', 'DIAGNOSIS', 'OTHER');

-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('WFA', 'HFA', 'HcFA');

-- CreateEnum
CREATE TYPE "ReminderMethod" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_REMINDER', 'BILLING', 'GENERAL', 'SECURITY');

-- CreateEnum
CREATE TYPE "FeedingType" AS ENUM ('BREAST', 'FORMULA', 'MIXED');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('NORMAL', 'DELAYED', 'ADVANCED', 'CONCERNING');

-- CreateEnum
CREATE TYPE "ImmunizationStatus" AS ENUM ('COMPLETED', 'PENDING', 'DELAYED', 'EXEMPTED');

-- CreateEnum
CREATE TYPE "DosageUnit" AS ENUM ('MG', 'ML', 'TABLET', 'MCG', 'G', 'IU', 'DROP', 'SPRAY', 'PUFF', 'UNIT');

-- CreateEnum
CREATE TYPE "DrugRoute" AS ENUM ('IV', 'PO', 'IM', 'SC', 'TOPICAL', 'INHALED', 'RECTAL', 'SUBLINGUAL', 'BUCCAL', 'TRANSDERMAL');

-- CreateEnum
CREATE TYPE "SavedFilterType" AS ENUM ('medical_records', 'patients', 'appointments', 'lab_tests');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "image" VARCHAR(512),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "isAdminUser" BOOLEAN DEFAULT false,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "timezone" TEXT DEFAULT 'UTC',
    "language" TEXT DEFAULT 'en',
    "isAdmin" BOOLEAN DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "record_id" TEXT,
    "model" TEXT NOT NULL,
    "userid" TEXT,
    "clinicId" TEXT,
    "clinicid" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL DEFAULT 'system',
    "theme" TEXT NOT NULL DEFAULT 'default',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "maintenanceStartedAt" TIMESTAMP(3),
    "maintenanceEndTime" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT DEFAULT 'UTC',
    "address" TEXT,
    "phone" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_to_clinics" (
    "user_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole",

    CONSTRAINT "users_to_clinics_pkey" PRIMARY KEY ("user_id","clinic_id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "clinic_id" TEXT,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "department" TEXT,
    "img" TEXT,
    "colorCode" TEXT,
    "availabilityStatus" TEXT,
    "available_from_week_day" INTEGER,
    "available_to_week_day" INTEGER,
    "isActive" BOOLEAN,
    "status" "Status",
    "available_from_time" TEXT,
    "available_to_time" TEXT,
    "type" "JOBTYPE" NOT NULL DEFAULT 'FULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appointment_price" DECIMAL(10,2) NOT NULL,
    "role" "UserRole",
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingDays" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "userId" TEXT,
    "clinicId" TEXT,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "img" TEXT,
    "licenseNumber" TEXT,
    "colorCode" TEXT,
    "hireDate" DATE DEFAULT CURRENT_TIMESTAMP,
    "salary" DOUBLE PRECISION,
    "role" "UserRole" NOT NULL,
    "status" "Status" DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT,
    "billId" TEXT,
    "patientId" TEXT,
    "appointmentId" TEXT NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "discount" DECIMAL(10,2),
    "totalAmount" DECIMAL(10,2),
    "amountPaid" DECIMAL(10,2),
    "amount" DECIMAL(10,2),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "insurance" TEXT,
    "insuranceId" TEXT,
    "serviceDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "receiptNumber" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "method" "ReminderMethod" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientBill" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(10,2),
    "totalCost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" "ServiceCategory",
    "duration" INTEGER,
    "isAvailable" BOOLEAN DEFAULT true,
    "clinicId" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_settings" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "workingDays" TEXT[],
    "defaultAppointmentDuration" INTEGER NOT NULL DEFAULT 30,
    "requireEmergencyContact" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "medical_record_id" TEXT NOT NULL,
    "doctorId" TEXT,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "medication_name" TEXT,
    "instructions" TEXT,
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "clinicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "who_growth_standards" (
    "id" TEXT NOT NULL,
    "age_in_months" INTEGER,
    "ageDays" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "measurement_type" "MeasurementType" NOT NULL,
    "l_value" DOUBLE PRECISION NOT NULL,
    "m_value" DOUBLE PRECISION NOT NULL,
    "s_value" DOUBLE PRECISION NOT NULL,
    "sd0" DOUBLE PRECISION NOT NULL,
    "sd1neg" DOUBLE PRECISION NOT NULL,
    "sd1pos" DOUBLE PRECISION NOT NULL,
    "sd2neg" DOUBLE PRECISION NOT NULL,
    "sd2pos" DOUBLE PRECISION NOT NULL,
    "sd3neg" DOUBLE PRECISION NOT NULL,
    "sd3pos" DOUBLE PRECISION NOT NULL,
    "sd4neg" DOUBLE PRECISION,
    "sd4pos" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "who_growth_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" SERIAL NOT NULL,
    "staff_id" TEXT,
    "patient_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoseGuideline" (
    "id" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "clinicalIndication" TEXT NOT NULL,
    "minDosePerKg" DOUBLE PRECISION,
    "maxDosePerKg" DOUBLE PRECISION,
    "doseUnit" TEXT,
    "frequencyDays" TEXT,
    "gestationalAgeWeeksMin" DOUBLE PRECISION,
    "gestationalAgeWeeksMax" DOUBLE PRECISION,
    "postNatalAgeDaysMin" DOUBLE PRECISION,
    "postNatalAgeDaysMax" DOUBLE PRECISION,
    "maxDosePer24h" DOUBLE PRECISION,
    "stockConcentrationMgMl" DOUBLE PRECISION,
    "finalConcentrationMgMl" DOUBLE PRECISION,
    "minInfusionTimeMin" INTEGER,
    "compatibilityDiluent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoseGuideline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescribed_items" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "dosageValue" DOUBLE PRECISION NOT NULL,
    "dosageUnit" "DosageUnit" NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescribed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "phone" TEXT,
    "emergencyContactNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "maritalStatus" TEXT,
    "nutritionalStatus" TEXT,
    "address" TEXT,
    "emergencyContactName" TEXT,
    "relation" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "medicalHistory" TEXT,
    "image" TEXT,
    "colorCode" TEXT,
    "role" "UserRole",
    "status" "Status" DEFAULT 'ACTIVE',
    "isActive" BOOLEAN DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bloodGroup" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "doctorId" TEXT NOT NULL,
    "serviceId" TEXT,
    "doctorSpecialty" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointment_price_in_cents" DECIMAL(10,2),
    "clinicId" TEXT,
    "time" TEXT,
    "status" "AppointmentStatus" DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "note" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecords" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "doctorId" TEXT,
    "treatmentPlan" TEXT,
    "labRequest" TEXT,
    "clinic_id" TEXT NOT NULL,
    "diagnosis" TEXT,
    "symptoms" TEXT,
    "notes" TEXT,
    "attachments" TEXT,
    "follow_up_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "MedicalRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT,
    "appointmentId" TEXT,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "notes" TEXT,
    "medicalId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "symptoms" TEXT NOT NULL,
    "prescribedMedications" TEXT,
    "followUpPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSigns" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT,
    "patientId" TEXT NOT NULL,
    "medicalId" TEXT NOT NULL,
    "bodyTemperature" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "heartRate" TEXT,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" INTEGER,
    "gender" "Gender",
    "ageDays" INTEGER,
    "ageMonths" INTEGER,
    "head_circumference" DECIMAL(5,2),
    "bmi" DECIMAL(5,2),
    "height_for_age_z" DECIMAL(4,3),
    "weight_for_age_z" DECIMAL(4,3),
    "bmi_for_age_z" DECIMAL(4,3),
    "hc_for_age_z" DECIMAL(4,3),
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Immunization" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vaccine" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dose" TEXT,
    "lotNumber" TEXT,
    "administeredByStaffId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Immunization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedingLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "FeedingType" NOT NULL,
    "duration" INTEGER,
    "amount" DOUBLE PRECISION,
    "breast" TEXT,
    "notes" TEXT,

    CONSTRAINT "FeedingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentalMilestone" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "ageAchieved" TEXT NOT NULL,
    "dateRecorded" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentalMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developmental_check" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "motorSkills" "DevelopmentStatus" NOT NULL,
    "languageSkills" "DevelopmentStatus" NOT NULL,
    "socialSkills" "DevelopmentStatus" NOT NULL,
    "cognitiveSkills" "DevelopmentStatus" NOT NULL,
    "milestonesMet" TEXT,
    "milestonesPending" TEXT,
    "concerns" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developmental_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccine_schedule" (
    "id" SERIAL NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "recommendedAge" TEXT NOT NULL,
    "doses_required" INTEGER NOT NULL,
    "minimumInterval" INTEGER,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ageInDaysMin" INTEGER,
    "ageInDaysMax" INTEGER,

    CONSTRAINT "vaccine_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" TEXT NOT NULL,
    "ex_clinic_id" TEXT NOT NULL,
    "ex_subcat_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ExpenseSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_filters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "filterType" "SavedFilterType",
    "isPublic" BOOLEAN DEFAULT false,
    "usageCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_saved_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserClinics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserClinics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ImmunizationToMedicalRecords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ImmunizationToMedicalRecords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_emailVerified_idx" ON "user"("emailVerified");

-- CreateIndex
CREATE INDEX "user_banned_idx" ON "user"("banned");

-- CreateIndex
CREATE INDEX "user_isDeleted_idx" ON "user"("isDeleted");

-- CreateIndex
CREATE INDEX "user_role_createdAt_idx" ON "user"("role", "createdAt");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_clinicId_idx" ON "audit_logs"("clinicId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_name_key" ON "clinics"("name");

-- CreateIndex
CREATE INDEX "clinics_isDeleted_idx" ON "clinics"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "doctors_clinic_id_isActive_idx" ON "doctors"("clinic_id", "isActive");

-- CreateIndex
CREATE INDEX "doctors_specialty_clinic_id_idx" ON "doctors"("specialty", "clinic_id");

-- CreateIndex
CREATE INDEX "doctors_isDeleted_idx" ON "doctors"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingDays_doctorId_day_key" ON "WorkingDays"("doctorId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE INDEX "Staff_deletedAt_idx" ON "Staff"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointmentId_key" ON "Payment"("appointmentId");

-- CreateIndex
CREATE INDEX "Payment_isDeleted_idx" ON "Payment"("isDeleted");

-- CreateIndex
CREATE INDEX "Payment_patientId_status_idx" ON "Payment"("patientId", "status");

-- CreateIndex
CREATE INDEX "Payment_status_dueDate_idx" ON "Payment"("status", "dueDate");

-- CreateIndex
CREATE INDEX "Payment_patientId_paymentDate_idx" ON "Payment"("patientId", "paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_appointmentId_key" ON "Reminder"("appointmentId");

-- CreateIndex
CREATE INDEX "Service_isDeleted_idx" ON "Service"("isDeleted");

-- CreateIndex
CREATE INDEX "Service_serviceName_idx" ON "Service"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_settings_clinicId_key" ON "clinic_settings"("clinicId");

-- CreateIndex
CREATE INDEX "prescriptions_clinicId_idx" ON "prescriptions"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_name_key" ON "Drug"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE INDEX "patients_clinic_id_lastName_idx" ON "patients"("clinic_id", "lastName");

-- CreateIndex
CREATE INDEX "patients_dateOfBirth_idx" ON "patients"("dateOfBirth");

-- CreateIndex
CREATE INDEX "patients_gender_dateOfBirth_idx" ON "patients"("gender", "dateOfBirth");

-- CreateIndex
CREATE INDEX "patients_clinic_id_status_idx" ON "patients"("clinic_id", "status");

-- CreateIndex
CREATE INDEX "patients_clinic_id_isActive_createdAt_idx" ON "patients"("clinic_id", "isActive", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "patients_firstName_lastName_idx" ON "patients"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "patients_isDeleted_idx" ON "patients"("isDeleted");

-- CreateIndex
CREATE INDEX "patients_createdAt_idx" ON "patients"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Appointment_isDeleted_idx" ON "Appointment"("isDeleted");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_status_idx" ON "Appointment"("doctorId", "status");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_status_idx" ON "Appointment"("clinicId", "status");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_createdAt_idx" ON "Appointment"("clinicId", "createdAt");

-- CreateIndex
CREATE INDEX "Appointment_deletedAt_idx" ON "Appointment"("deletedAt");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_appointmentDate_status_idx" ON "Appointment"("clinicId", "appointmentDate", "status");

-- CreateIndex
CREATE INDEX "Appointment_patientId_appointmentDate_idx" ON "Appointment"("patientId", "appointmentDate" DESC);

-- CreateIndex
CREATE INDEX "Appointment_doctorId_appointmentDate_idx" ON "Appointment"("doctorId", "appointmentDate" DESC);

-- CreateIndex
CREATE INDEX "Appointment_status_appointmentDate_idx" ON "Appointment"("status", "appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_recordId_key" ON "LabTest"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_serviceId_key" ON "LabTest"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecords_appointmentId_key" ON "MedicalRecords"("appointmentId");

-- CreateIndex
CREATE INDEX "MedicalRecords_isDeleted_idx" ON "MedicalRecords"("isDeleted");

-- CreateIndex
CREATE INDEX "MedicalRecords_patientId_created_at_idx" ON "MedicalRecords"("patientId", "created_at" DESC);

-- CreateIndex
CREATE INDEX "MedicalRecords_clinic_id_follow_up_date_patientId_idx" ON "MedicalRecords"("clinic_id", "follow_up_date", "patientId");

-- CreateIndex
CREATE INDEX "MedicalRecords_patientId_follow_up_date_idx" ON "MedicalRecords"("patientId", "follow_up_date");

-- CreateIndex
CREATE INDEX "MedicalRecords_clinic_id_created_at_idx" ON "MedicalRecords"("clinic_id", "created_at");

-- CreateIndex
CREATE INDEX "MedicalRecords_clinic_id_idx" ON "MedicalRecords"("clinic_id");

-- CreateIndex
CREATE INDEX "MedicalRecords_doctorId_idx" ON "MedicalRecords"("doctorId");

-- CreateIndex
CREATE INDEX "MedicalRecords_follow_up_date_idx" ON "MedicalRecords"("follow_up_date");

-- CreateIndex
CREATE INDEX "MedicalRecords_patientId_appointmentId_idx" ON "MedicalRecords"("patientId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecords_patientId_appointmentId_key" ON "MedicalRecords"("patientId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_medicalId_key" ON "Diagnosis"("medicalId");

-- CreateIndex
CREATE INDEX "Diagnosis_isDeleted_idx" ON "Diagnosis"("isDeleted");

-- CreateIndex
CREATE INDEX "Diagnosis_clinicId_date_idx" ON "Diagnosis"("clinicId", "date");

-- CreateIndex
CREATE INDEX "Diagnosis_doctorId_date_idx" ON "Diagnosis"("doctorId", "date");

-- CreateIndex
CREATE INDEX "Diagnosis_patientId_date_idx" ON "Diagnosis"("patientId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "VitalSigns_encounterId_key" ON "VitalSigns"("encounterId");

-- CreateIndex
CREATE UNIQUE INDEX "VitalSigns_medicalId_key" ON "VitalSigns"("medicalId");

-- CreateIndex
CREATE INDEX "VitalSigns_patientId_recordedAt_idx" ON "VitalSigns"("patientId", "recordedAt");

-- CreateIndex
CREATE INDEX "VitalSigns_encounterId_idx" ON "VitalSigns"("encounterId");

-- CreateIndex
CREATE INDEX "VitalSigns_patientId_ageMonths_idx" ON "VitalSigns"("patientId", "ageMonths");

-- CreateIndex
CREATE INDEX "VitalSigns_gender_ageDays_idx" ON "VitalSigns"("gender", "ageDays");

-- CreateIndex
CREATE INDEX "VitalSigns_patientId_ageDays_idx" ON "VitalSigns"("patientId", "ageDays");

-- CreateIndex
CREATE INDEX "Immunization_patientId_vaccine_date_idx" ON "Immunization"("patientId", "vaccine", "date");

-- CreateIndex
CREATE INDEX "Immunization_patientId_date_idx" ON "Immunization"("patientId", "date");

-- CreateIndex
CREATE INDEX "FeedingLog_patientId_date_idx" ON "FeedingLog"("patientId", "date");

-- CreateIndex
CREATE INDEX "developmental_check_patientId_checkDate_idx" ON "developmental_check"("patientId", "checkDate");

-- CreateIndex
CREATE INDEX "developmental_check_ageMonths_idx" ON "developmental_check"("ageMonths");

-- CreateIndex
CREATE INDEX "vaccine_schedule_ageInDaysMin_ageInDaysMax_idx" ON "vaccine_schedule"("ageInDaysMin", "ageInDaysMax");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_schedule_vaccine_name_recommendedAge_key" ON "vaccine_schedule"("vaccine_name", "recommendedAge");

-- CreateIndex
CREATE INDEX "ex_clinic_date_idx" ON "expense"("ex_clinic_id", "date" DESC);

-- CreateIndex
CREATE INDEX "ex_cat_date_idx" ON "expense"("ex_subcat_id", "date");

-- CreateIndex
CREATE INDEX "user_saved_filters_user_clinic_idx" ON "user_saved_filters"("userId", "clinicId");

-- CreateIndex
CREATE INDEX "user_saved_filters_public_idx" ON "user_saved_filters"("isPublic");

-- CreateIndex
CREATE INDEX "user_saved_filters_type_idx" ON "user_saved_filters"("filterType");

-- CreateIndex
CREATE INDEX "_UserClinics_B_index" ON "_UserClinics"("B");

-- CreateIndex
CREATE INDEX "_ImmunizationToMedicalRecords_B_index" ON "_ImmunizationToMedicalRecords"("B");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_clinicid_fkey" FOREIGN KEY ("clinicid") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_to_clinics" ADD CONSTRAINT "users_to_clinics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_to_clinics" ADD CONSTRAINT "users_to_clinics_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingDays" ADD CONSTRAINT "WorkingDays_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientBill" ADD CONSTRAINT "PatientBill_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientBill" ADD CONSTRAINT "PatientBill_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_settings" ADD CONSTRAINT "clinic_settings_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Diagnosis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseGuideline" ADD CONSTRAINT "DoseGuideline_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribed_items" ADD CONSTRAINT "prescribed_items_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribed_items" ADD CONSTRAINT "prescribed_items_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Immunization" ADD CONSTRAINT "Immunization_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Immunization" ADD CONSTRAINT "Immunization_administeredByStaffId_fkey" FOREIGN KEY ("administeredByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedingLog" ADD CONSTRAINT "FeedingLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentalMilestone" ADD CONSTRAINT "DevelopmentalMilestone_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developmental_check" ADD CONSTRAINT "developmental_check_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_ex_clinic_id_fkey" FOREIGN KEY ("ex_clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_ex_subcat_id_fkey" FOREIGN KEY ("ex_subcat_id") REFERENCES "ExpenseSubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSubCategory" ADD CONSTRAINT "ExpenseSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_filters" ADD CONSTRAINT "user_saved_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_filters" ADD CONSTRAINT "user_saved_filters_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClinics" ADD CONSTRAINT "_UserClinics_A_fkey" FOREIGN KEY ("A") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClinics" ADD CONSTRAINT "_UserClinics_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImmunizationToMedicalRecords" ADD CONSTRAINT "_ImmunizationToMedicalRecords_A_fkey" FOREIGN KEY ("A") REFERENCES "Immunization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImmunizationToMedicalRecords" ADD CONSTRAINT "_ImmunizationToMedicalRecords_B_fkey" FOREIGN KEY ("B") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
