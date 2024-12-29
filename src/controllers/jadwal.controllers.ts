import { Request, Response } from 'express';
import { JadwalService } from '../services/jadwal.service';

export class JadwalController {
    private service: JadwalService;

    constructor() {
        this.service = new JadwalService();
    }

    getMahasiswa = async (req: Request, res: Response) => {
        try {
            const mahasiswaList = await this.service.getMahasiswa();
            res.json(mahasiswaList);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch mahasiswa list' });
        }
    };

    getDosenPenguji = async (req: Request, res: Response) => {
        try {
            const dosenList = await this.service.getDosenPenguji();
            res.json(dosenList);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch dosen penguji list' });
        }
    };

    checkDosenAvailability = async (req: Request, res: Response) => {
        try {
            const { dosenId, tanggal, waktuMulai } = req.query as {
                dosenId: string;
                tanggal: string;
                waktuMulai: string;
            };

            const availability = await this.service.checkDosenAvailability(
                dosenId,
                tanggal,
                waktuMulai
            );

            res.json(availability);
        } catch (error) {
            res.status(500).json({ error: 'Failed to check dosen availability' });
        }
    };

    createJadwal = async (req: Request, res: Response) => {
        try {
            const jadwal = await this.service.createJadwal(req.body);
            res.status(201).json(jadwal);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to create jadwal' });
            }
        }
    };

    getAllJadwal = async (req: Request, res: Response) => {
        try {
            const schedules = await this.service.getAllSchedules();
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch schedules' });
        }
    };
}