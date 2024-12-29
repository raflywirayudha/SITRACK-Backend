import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.services';

const profileService = new ProfileService();

export class ProfileController {
    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user.id; // Assuming you have user info in request
            const userRoles = req.user.roles;

            let profile;
            if (userRoles.includes('mahasiswa')) {
                profile = await profileService.getStudentProfile(userId);
            } else if (userRoles.includes('dosen')) {
                profile = await profileService.getLecturerProfile(userId);
            } else if (userRoles.includes('pembimbing_instansi')) {
                profile = await profileService.getIndustryAdvisorProfile(userId);
            }

            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const updatedProfile = await profileService.updateProfile(userId, req.body);
            res.json(updatedProfile);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}