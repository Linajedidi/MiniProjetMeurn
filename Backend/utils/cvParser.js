const fs = require("fs");
const pdfParse = require("pdf-parse");

// Lire le PDF
async function extractTextFromCV(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

// Extraire compétences
function extractSkills(text) {
  const skillsList = [
    "nodejs", "react", "mongodb", "express",
    "java", "python", "sql", "angular"
  ];

  const lowerText = text.toLowerCase();

  return skillsList.filter(skill =>
    lowerText.includes(skill)
  );
}

//Extraire expérience 
function extractExperience(text) {
  const match = text.match(/(\d+)\s+(years|ans)/i);
  return match ? parseInt(match[1]) : 0;
}

module.exports = {
  extractTextFromCV,
  extractSkills,
  extractExperience
};