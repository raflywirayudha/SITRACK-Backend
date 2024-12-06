import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

const postDocument = async (
    req: Request,
    res: Response,
    modelName: 'Persyaratan' | 'Pendaftaran' | 'PascaSeminar'
) => {
    try {
        const {nim, koordinatorId} = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({error: 'No file uploaded'})
        }

        const documentData = {
            nama: file.originalname,
            filePath: file.path,
            tanggalUpload: new Date(),
            status: 'submitted',
            komentar: null
        }

        const createdDocument = await (prisma[modelName.toLowerCase() as keyof typeof prisma] as any).create({
            data: documentData
        })

        await prisma.dokumen.create({
            data: {
                nim: nim,
                koordinatorId: koordinatorId,
                [`${modelName.toLowerCase()}Id`]: createdDocument.id,
                persyaratanId: modelName === 'Persyaratan' ? createdDocument.id : undefined,
                pendaftaranId: modelName === 'Pendaftaran' ? createdDocument.id : undefined,
                pascaSeminarId: modelName === 'PascaSeminar' ? createdDocument.id : undefined,
            }
        })

        res.status(201).json(createdDocument)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Document upload failed'})
    }
}

const getDocuments = async (
    req: Request,
    res: Response,
    modelName: 'Persyaratan' | 'Pendaftaran' | 'PascaSeminar'
) => {
    try {
        const {nim, status} = req.query
        const documents = await (prisma[modelName.toLowerCase() as keyof typeof prisma] as any).findMany({
            where: {
                ...(nim ? {dokumen: {some: {nim: String(nim)}}} : {}),
                ...(status ? {status: status as any} : {})
            }
        })
        res.json(documents)
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve documents'})
    }
}

const updateDocument = async (
    req: Request,
    res: Response,
    modelName: 'Persyaratan' | 'Pendaftaran' | 'PascaSeminar'
) => {
    try {
        const {id} = req.params
        const {status, komentar} = req.body

        const updatedDocument = await (prisma[modelName.toLowerCase() as keyof typeof prisma] as any).update({
            where: {id},
            data: {
                ...(status && {status}),
                ...(komentar && {komentar})
            }
        })

        res.json(updatedDocument)
    } catch (error) {
        res.status(500).json({error: 'Failed to update document'})
    }
}

export {
    postDocument,
    getDocuments,
    updateDocument
};
