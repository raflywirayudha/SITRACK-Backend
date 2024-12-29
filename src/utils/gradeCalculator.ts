interface GradeInput {
    nilaiPembimbing: number;
    nilaiPenguji: number;
    nilaiPembimbingInstansi: number;
}

export const calculateFinalGrade = (grades: GradeInput): number => {
    const weights = {
        pembimbing: 0.4,
        penguji: 0.2,
        pembimbingInstansi: 0.4
    };

    const nilaiAkhir = (
        grades.nilaiPembimbing * weights.pembimbing +
        grades.nilaiPenguji * weights.penguji +
        grades.nilaiPembimbingInstansi * weights.pembimbingInstansi
    );

    return Number(nilaiAkhir.toFixed(2));
};

export const calculateFinalGradePembimbingInstansi = (grades: GradeInput): number => {
    const weights = {
        deliverables: 0.25,
        punctuality: 0.15,
        discipline: 0.15,
        attitude: 0.15,
        teamwork: 0.15,
        initiative: 0.15
    };

    const weightedSum = Object.entries(grades).reduce((sum, [key, value]) => {
        if (key in weights) {
            return sum + (value * weights[key as keyof typeof weights]);
        }
        return sum;
    }, 0);

    return Number(weightedSum.toFixed(2));
};