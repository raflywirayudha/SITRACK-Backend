export interface GradeInput {
    deliverables: number;
    punctuality: number;
    discipline: number;
    attitude: number;
    teamwork: number;
    initiative: number;
    comment?: string;
}

export interface Grade extends GradeInput {
    id: string;
    nim: string;
    pembimbingInstansiId: string;
    finalGrade: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GradeInputDosenPenguji {
    scientific: string;
    presentation: string;
    project: string;
    comment?: string;
}

export interface GradeCalculationDosenPenguji {
    gradePoints: number;
    letterGrade: string;
}

export interface CreateNilaiDTO {
    nim: string;
    jadwalSeminarId: string;
    nilaiPembimbing?: number;
    nilaiPenguji?: number;
    nilaiPembimbingInstansi?: number;
    dosenPembimbingId?: string;
    dosenPengujiId?: string;
    pembimbingInstansiId?: string;
}

export interface UpdateNilaiDTO extends Partial<CreateNilaiDTO> {
    nilaiAkhir?: number;
    isFinalized?: boolean;
    finalizedBy?: string;
    finalizedAt?: Date;
}

export interface InputNilaiPengujiDTO {
    jadwalSeminarId: string;
    nilaiPenguji: number;
}