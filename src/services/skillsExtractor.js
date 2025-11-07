const openai = require('../config/openai.js');
require('dotenv').config();
async function extractSkills(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are a skilled HR professional analyzing resumes."
            }, {
                role: "user",
                content: `Extract technical skills, soft skills, and professional qualifications from the following resume text. Format the response as a JSON object with three arrays: technicalSkills, softSkills, and qualifications. Text: ${text}`
            }],
            temperature: 0.5,
            max_tokens: 1000
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Skills extraction error:', error);
        throw new Error('Failed to extract skills from resume');
    }
}


const HF_API_KEY = process.env.HF_API_KEY; // from https://huggingface.co/settings/tokens

async function extractSkillsByHuggingFace(text) {
    try {
        console.log("debug a11111111");
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `
            Extract key details from this resume text.
            Return JSON with these keys:
            {
              "technicalSkills": [...],
              "softSkills": [...],
              "qualifications": [...]
            }

            Resume Text:
            ${text}
          `,
                }),
            }
        );
        console.log("debug a11111111 data ppp:", response);

        const data = await response.json();
        console.log("debug a11111111 data:", data);

        const output = Array.isArray(data)
            ? data[0]?.generated_text || ""
            : data.generated_text || JSON.stringify(data);

        // Try to extract JSON from text safely
        const jsonMatch = output.match(/{[\s\S]*}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
        console.error("Skill extraction error:", error);
        return { technicalSkills: [], softSkills: [], qualifications: [] };
    }
}



module.exports = {
    extractSkills,
    extractSkillsByHuggingFace,
};