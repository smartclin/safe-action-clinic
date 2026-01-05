// prisma/seeders/admin.ts

import { faker } from '@faker-js/faker';
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/client';
import { auth } from '@/lib/auth';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://drhazem:HealthF24@localhost:5432/smartdb'
});

const prisma = new PrismaClient({
    adapter
});

async function seedAdmin() {
    console.log('🌱 Starting admin user, clinic, and doctor profile seed...');

    const adminEmail = 'clinysmar@gmail.com';
    const adminPassword = 'HealthF24';
    const adminName = 'Dr. Ali';
    const adminPhone = '01033022221';
    const clinicName = 'Smart Clinic';

    try {
        // Step 1: Create or update admin user via BetterAuth API
        console.log('Creating admin user...');
        const { user: authUser } = await auth.api.createUser({
            body: {
                email: adminEmail,
                password: adminPassword,
                name: adminName,
                role: 'admin',
                data: {
                    role: 'admin',
                    isAdmin: true,
                    phone: adminPhone
                }
            }
        });

        console.log(`👨‍💻 Admin user created/updated: ${authUser.email}`);

        // Step 2: Upsert the user in Prisma database
        console.log('Upserting user in database...');
        const user = await prisma.user.upsert({
            where: { id: authUser.id },
            update: {
                name: adminName,
                email: adminEmail,
                role: 'admin',
                emailVerified: true,
                isDeleted: false,
                isAdmin: true,
                phone: adminPhone
            },
            create: {
                id: authUser.id,
                name: adminName,
                email: adminEmail,
                role: 'admin',
                emailVerified: true,
                isDeleted: false,
                isAdmin: true,
                phone: adminPhone
            }
        });

        // Step 3: Create or update clinic
        console.log('Creating clinic...');
        const clinic = await prisma.clinic.upsert({
            where: { name: user.name },
            update: {
                address: 'Hurghada, Egypt',
                phone: adminPhone,
                email: adminEmail,
                timezone: 'Africa/Cairo',
                name: clinicName,
                isDeleted: false
            },
            create: {
                name: clinicName,
                address: 'Hurghada, Egypt',
                phone: adminPhone,
                email: adminEmail,
                timezone: 'Africa/Cairo',
                isDeleted: false
            }
        });

        console.log(`🏥 Clinic created/updated: ${clinic.name}`);

        // Step 4: Create or update admin doctor profile linked to clinic
        console.log('Creating admin doctor profile...');
        const adminDoctor = await prisma.doctor.upsert({
            where: { userId: authUser.id },
            update: {
                name: adminName,
                specialty: 'Pediatrician',
                licenseNumber: 'SMART-ADM-001',
                phone: adminPhone,
                address: 'Hurghada, Egypt',
                department: 'Pediatrics',
                img: faker.image.avatar(),
                colorCode: faker.color.rgb(),
                availabilityStatus: 'Available',
                type: 'FULL',
                role: 'ADMIN',
                availableFromWeekDay: 1,
                availableToWeekDay: 5,
                availableFromTime: '09:00',
                availableToTime: '17:00',
                appointmentPrice: 0,
                clinicId: clinic.id,
                userId: user.id
            },
            create: {
                email: adminEmail,
                name: adminName,
                specialty: 'Pediatrician',
                licenseNumber: 'SMART-ADM-001',
                phone: adminPhone,
                address: 'Hurghada, Egypt',
                department: 'Pediatrics',
                img: faker.image.avatar(),
                colorCode: faker.color.rgb(),
                availabilityStatus: 'Available',
                type: 'FULL',
                role: 'ADMIN',
                availableFromWeekDay: 1,
                availableToWeekDay: 5,
                availableFromTime: '09:00',
                availableToTime: '17:00',
                appointmentPrice: 0,
                clinicId: clinic.id,
                userId: user.id
            }
        });

        console.log(`👨‍⚕️ Admin doctor profile created/updated: ${adminDoctor.name}`);

        // Step 5: Create clinic membership for admin doctor
        console.log('Creating clinic membership...');
        const clinicMember = await prisma.clinicMember.upsert({
            where: {
                userId_clinicId: {
                    userId: user.id,
                    clinicId: clinic.id
                }
            },
            update: {
                role: 'ADMIN'
            },
            create: {
                userId: user.id,
                clinicId: clinic.id,
                role: 'ADMIN'
            }
        });

        console.log(`👥 Clinic membership created: ${clinicMember.role} role`);

        // Step 6: Add additional sample doctors if needed
        console.log('Creating sample doctors...');
        const sampleDoctors = [
            {
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@smartclinic.com',
                specialty: 'Cardiologist',
                licenseNumber: 'SMART-CARD-001',
                phone: '01033022222',
                department: 'Cardiology'
            },
            {
                name: 'Dr. Michael Chen',
                email: 'michael.chen@smartclinic.com',
                specialty: 'Neurologist',
                licenseNumber: 'SMART-NEUR-001',
                phone: '01033022223',
                department: 'Neurology'
            }
        ];

        for (const doctorData of sampleDoctors) {
            const doctor = await prisma.doctor.upsert({
                where: { userId: user.id },
                update: {
                    ...doctorData,
                    clinicId: clinic.id,
                    availabilityStatus: 'Available',
                    type: 'FULL',
                    role: 'DOCTOR',
                    appointmentPrice: 150,
                    img: faker.image.avatar(),
                    colorCode: faker.color.rgb()
                },
                create: {
                    ...doctorData,
                    clinicId: clinic.id,
                    availabilityStatus: 'Available',
                    type: 'FULL',
                    role: 'DOCTOR',
                    appointmentPrice: 150,
                    img: faker.image.avatar(),
                    colorCode: faker.color.rgb(),
                    availableFromWeekDay: 1,
                    availableToWeekDay: 5,
                    availableFromTime: '08:00',
                    availableToTime: '16:00'
                }
            });
            console.log(`👨‍⚕️ Sample doctor created: ${doctor.name}`);
        }

        console.log('✅ Seed process finished successfully.');
        console.log('📋 Summary:');
        console.log(`   - Admin User: ${user.email}`);
        console.log(`   - Clinic: ${clinic.name} (ID: ${clinic.id})`);
        console.log(`   - Admin Doctor: ${adminDoctor.name}`);
        console.log('   - Clinic Members: 1 admin member created');
        console.log(`   - Sample Doctors: ${sampleDoctors.length} created`);
    } catch (error) {
        console.error('❌ An error occurred during the seed process:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute seed
seedAdmin()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
