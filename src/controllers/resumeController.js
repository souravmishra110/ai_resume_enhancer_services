const Resume = require('../models/Resume');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const { extractSkills, extractSkillsByHuggingFace } = require('../services/skillsExtractor');

const resumeController = {

    getAllResumes: async (req, res) => {
        try {
            // Implementation
            res.status(200).json({ resumes: [] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getResumeById: async (req, res) => {
        try {
            // Implementation
            res.status(200).json({ resume: {} });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    analyseResume: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No PDF file uploaded' });
            }

            const dataBuffer = await fs.readFile(req.file.path);
            const pdfData = await pdfParse(dataBuffer);

            // Extract text content from PDF
            const textContent = pdfData.text;

            // Extract skills using the imported service
            console.log("debug textContent 1111111");
            const skillsAnalysis = await extractSkillsByHuggingFace(textContent);
            console.log("debug textContent 222222");

            // Process the extracted text as needed
            // You can add your resume analysis logic here
            const analysis = {
                totalPages: pdfData.numpages,
                textContent: textContent,
                skills: skillsAnalysis,
                // Add more analysis fields as needed
            };

            // Clean up: Delete the uploaded file after processing
            await fs.unlink(req.file.path);

            res.status(200).json({ analysis });
        } catch (error) {
            // Clean up file in case of error
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            console.log("debug err", error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = resumeController;