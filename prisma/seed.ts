const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { name: 'mahasiswa' },
            { name: 'dosen_pembimbing' },
            { name: 'dosen_penguji' },
            { name: 'kaprodi' },
            { name: 'koordinator' },
            { name: 'pembimbing_instansi' },
        ],
        skipDuplicates: true,
    });
    console.log('Roles seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
