import express from 'express';
import multer from 'multer';
import { analyzeCrop } from '../controllers/advisoryController';

const router = express.Router();

// Store files in memory so we can pass the buffer directly to Python
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route
router.post('/analyze', upload.single('file'), analyzeCrop);

export default router;