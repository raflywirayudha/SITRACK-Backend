import { PrismaClient } from '@prisma/client';
import { UpdateDocumentStatusDTO } from '../types/document.types';

export class DocumentService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getStudentsWithDocuments() {
        return this.prisma.mahasiswa.findMany({
            include: {
                user: true,
                dokumen: {
                    orderBy: { tanggalUpload: 'desc' }
                }
            }
        });
    }

    async updateDocumentStatus(id: string, userId: string, data: UpdateDocumentStatusDTO) {
        const document = await this.prisma.dokumen.findUnique({
            where: { id },
            include: { history: true }
        });

        if (!document) {
            throw new Error('Document not found');
        }

        const [history, updatedDoc] = await this.prisma.$transaction([
            this.prisma.dokumenHistory.create({
                data: {
                    dokumenId: document.id,
                    nim: document.nim,
                    userId: document.userId,
                    jenisDokumen: document.jenisDokumen,
                    kategori: document.kategori,
                    filePath: document.filePath,
                    version: (document.history.length || 0) + 1
                }
            }),
            this.prisma.dokumen.update({
                where: { id },
                data: { status: data.status }
            })
        ]);

        await this.prisma.dokumenReview.create({
            data: {
                dokumenId: id,
                historyId: history.id,
                koordinatorId: userId,
                status: data.status,
                komentar: data.komentar,
                nim: document.nim,
                userId: document.userId
            }
        });

        return updatedDoc;
    }
}