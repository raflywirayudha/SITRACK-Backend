import prisma from "../configs/prisma.configs"

type Student = {
    name: string;
    nim: string;
    department: string;
    status: string;
    company: string;
    pembimbing: string;
    judulKP: string;
    action: string;
    jadwalSeminarId: string;
};

export class DosenPengujiServices {
    async getStudentsByExaminer(dosenId: string): Promise<Student[]> {
        try {
            const studentsWithSchedule = await prisma.jadwalSeminar.findMany({
                where: {
                    dosenId: dosenId,
                },
                include: {
                    mahasiswa: {
                        include: {
                            user: {
                                select: {
                                    nama: true,
                                },
                            },
                            mahasiswaKp: {
                                include: {
                                    dosenPembimbing: {
                                        include: {
                                            user: {
                                                select: {
                                                    nama: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                },
            });

            return studentsWithSchedule.map((schedule) => ({
                name: schedule.mahasiswa.user.nama,
                nim: schedule.mahasiswa.nim,
                department: "",
                status: schedule.status,
                company: schedule.mahasiswa.mahasiswaKp?.namaInstansi || "-",
                pembimbing: schedule.mahasiswa.mahasiswaKp?.dosenPembimbing?.user.nama || "-",
                judulKP: schedule.mahasiswa.mahasiswaKp?.judulLaporan || "-",
                action: `View/${schedule.id}`,
                jadwalSeminarId: schedule.id// Assuming action is a view link with schedule ID
            }));
        } catch (error) {
            throw new Error('Failed to fetch students by examiner');
        }
    }
}