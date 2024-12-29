import prisma from "../configs/prisma.configs"

export class ProfileService {
    async getStudentProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                mahasiswa: {
                    include: {
                        mahasiswaKp: true
                    }
                }
            }
        });
    }

    async getLecturerProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                dosen: true
            }
        });
    }

    async getIndustryAdvisorProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                pembimbingInstansi: true
            }
        });
    }

    async updateProfile(userId: string, data: any) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                mahasiswa: true,
                dosen: true,
                pembimbingInstansi: true
            }
        });

        if (!user) throw new Error('User not found');

        return await prisma.$transaction(async (tx) => {
            // Update base user info
            await tx.user.update({
                where: { id: userId },
                data: {
                    nama: data.nama,
                    email: data.email,
                    photoPath: data.photoPath
                }
            });

            // Update role-specific info
            if (user.mahasiswa) {
                await tx.mahasiswa.update({
                    where: { userId },
                    data: {
                        noHp: data.noHp,
                        semester: data.semester
                    }
                });
            }

            if (user.dosen) {
                await tx.dosen.update({
                    where: { userId },
                    data: {
                        nip: data.nip
                    }
                });
            }

            if (user.pembimbingInstansi) {
                await tx.pembimbingInstansi.update({
                    where: { userId },
                    data: {
                        instansi: data.instansi,
                        jabatan: data.jabatan,
                        noTelpon: data.noTelpon
                    }
                });
            }

            return await this.getProfileByUserId(userId);
        });
    }

    private async getProfileByUserId(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                mahasiswa: {
                    include: {
                        mahasiswaKp: true
                    }
                },
                dosen: true,
                pembimbingInstansi: true
            }
        });

        return user;
    }
}