import 'dotenv/config';

import { faker } from '@faker-js/faker';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

async function seedAdmin() {
    console.log('🌱 Starting admin user, clinic, and doctor profile seed...');

    const adminEmail = 'clinysmar@gmail.com';
    const adminPassword = 'HealthF24';
    const adminName = 'Dr. Ali';
    const adminPhone = '01033022221';
    const clinicName = 'Smart Clinic';

    try {
        // 1️⃣ Create or update admin user via server-only auth
        console.log('Creating admin user...');
        const { user: authUser } = await auth.api.createUser({
            body: {
                email: adminEmail,
                password: adminPassword,
                name: adminName,
                role: 'admin',
                data: { role: 'admin', isAdmin: true, phone: adminPhone }
            }
        });
        console.log(`👨‍💻 Admin user created/updated: ${authUser.email}`);

        // 2️⃣ Upsert Prisma user
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

        // 3️⃣ Upsert clinic
        const clinic = await prisma.clinic.upsert({
            where: { name: clinicName },
            update: {
                address: 'Hurghada, Egypt',
                phone: adminPhone,
                email: adminEmail,
                timezone: 'Africa/Cairo',
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

        // 4️⃣ Upsert admin doctor
        const adminDoctor = await prisma.doctor.upsert({
            where: { userId: user.id },
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
                clinicId: clinic.id
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

        // 5️⃣ Clinic membership
        await prisma.clinicMember.upsert({
            where: { userId_clinicId: { userId: user.id, clinicId: clinic.id } },
            update: { role: 'ADMIN' },
            create: { userId: user.id, clinicId: clinic.id, role: 'ADMIN' }
        });

        console.log('✅ Seed process finished successfully');
        console.log(`📋 Admin User: ${user.email}, Clinic: ${clinic.name}, Admin Doctor: ${adminDoctor.name}`);
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Only run if executed directly (Bun-compatible)
if (import.meta.main) {
    seedAdmin()
        .catch(e => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => await prisma.$disconnect());
}
