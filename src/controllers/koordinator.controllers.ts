import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

