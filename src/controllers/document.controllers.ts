import { Request, Response } from 'express';
import { DocumentService } from '../services/document.services';

export class DocumentController {
    private documentService: DocumentService;

    constructor() {
        this.documentService = new DocumentService();
    }

    getStudents = async (req: Request, res: Response) => {
        try {
            const students = await this.documentService.getStudentsWithDocuments();
            res.json({
                success: true,
                message: 'Successfully retrieved students data',
                data: students
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving students data',
                error
            });
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const document = await this.documentService.updateDocumentStatus(id, userId, req.body);

            res.json({
                success: true,
                message: 'Successfully updated document status',
                data: document
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating document status',
                error
            });
        }
    };
}