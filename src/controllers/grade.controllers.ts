import { Request, Response } from 'express';
import { GradeService } from '../services/nilai.services';
import { GradeInput } from '../types/nilai.types';

export class GradeController {
    private gradeService: GradeService;

    constructor() {
        this.gradeService = new GradeService();
    }

    submitGrade = async (req: Request, res: Response) => {
        try {
            const { nim } = req.params;
            const pembimbingInstansiId = req.user.id;
            const gradeInput: GradeInput = req.body;

            const result = await this.gradeService.submitGrade(
                nim,
                pembimbingInstansiId,
                gradeInput
            );

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error submitting grade:', error);
            return res.status(500).json({ error: 'Failed to submit grade' });
        }
    };

    getGrade = async (req: Request, res: Response) => {
        try {
            const { nim } = req.params;
            const pembimbingInstansiId = req.user.id;

            const grade = await this.gradeService.getGrade(nim, pembimbingInstansiId);

            if (!grade) {
                return res.status(404).json({ error: 'Grade not found' });
            }

            return res.status(200).json(grade);
        } catch (error) {
            console.error('Error fetching grade:', error);
            return res.status(500).json({ error: 'Failed to fetch grade' });
        }
    };
}