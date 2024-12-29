import prisma from '../configs/prisma.configs';
import { GradeInput } from '../types/nilai.types';
import { calculateFinalGradePembimbingInstansi } from '../utils/gradeCalculator';
import { GradeInputDosenPenguji, GradeCalculationDosenPenguji } from "../types/nilai.types";

export class GradeService {
    async submitGrade(nim: string, pembimbingInstansiId: string, gradeInput: GradeInput) {
        const finalGrade = calculateFinalGradePembimbingInstansi(gradeInput);

        const existingNilai = await prisma.nilai.findFirst({
            where: {
                nim,
                pembimbingInstansiId
            }
        });

        if (existingNilai) {
            return await prisma.nilai.update({
                where: { id: existingNilai.id },
                data: {
                    nilaiPembimbingInstansi: finalGrade,
                    updatedAt: new Date()
                }
            });
        }

        return await prisma.nilai.create({
            data: {
                nim,
                pembimbingInstansiId,
                nilaiPembimbingInstansi: finalGrade,
            }
        });
    }

    async getGrade(nim: string, pembimbingInstansiId: string) {
        return await prisma.nilai.findFirst({
            where: {
                nim,
                pembimbingInstansiId
            }
        });
    }
}

export class GradeServiceDosenPenguji {
    private static readonly GRADE_VALUES: { [key: string]: number } = {
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'D': 1.0
    };

    private static calculateGradePoints(grades: GradeInputDosenPenguji): number {
        const { scientific, presentation, project } = grades;

        // Convert letter grades to numeric values
        const scientificPoints = this.GRADE_VALUES[scientific] || 0;
        const presentationPoints = this.GRADE_VALUES[presentation] || 0;
        const projectPoints = this.GRADE_VALUES[project] || 0;

        return (scientificPoints + presentationPoints + projectPoints) / 3;
    }

    private static getLetterGrade(points: number): string {
        if (points >= 3.85) return 'A';
        if (points >= 3.5) return 'A-';
        if (points >= 3.15) return 'B+';
        if (points >= 2.85) return 'B';
        if (points >= 2.5) return 'B-';
        if (points >= 2.15) return 'C+';
        if (points >= 2) return 'C';
        return 'D';
    }

    public static calculateFinalGrade(grades: GradeInput): GradeCalculationDosenPenguji {
        const gradePoints = this.calculateGradePoints(grades);
        const letterGrade = this.getLetterGrade(gradePoints);

        return {
            gradePoints,
            letterGrade
        };
    }

    public static async submitGrade(jadwalSeminarId: string, dosenId: string, grades: GradeInput) {
        const { gradePoints } = this.calculateFinalGrade(grades);

        return await prisma.nilai.update({
            where: {
                jadwalSeminarId
            },
            data: {
                nilaiPenguji: gradePoints,
                dosenPengujiId: dosenId,
                updatedAt: new Date()
            }
        });
    }
}