const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const upload = require('../utils/fileUpload');

router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);
router.post('/analyse', upload.single('resume'), resumeController.analyseResume);

module.exports = router;