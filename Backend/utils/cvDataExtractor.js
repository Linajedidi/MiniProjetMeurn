const { extractTextFromCV, extractSkills, extractExperience } = require("./cvParser");

async function extractCandidateData(cvDoc) {
  let skills = [];
  let experience = 0;
  let niveau = "";

  //  PRIORITÉ 1 : données formulaire
  if (cvDoc.competences && cvDoc.competences.length > 0) {
    skills = cvDoc.competences;
    experience = parseInt(cvDoc.experiences) || 0;
    niveau = cvDoc.niveaux || "";
  }

  //  PRIORITÉ 2 : fallback PDF
  else if (cvDoc.filePath) {
    try {
      const text = await extractTextFromCV(cvDoc.filePath);

      skills = extractSkills(text);
      experience = extractExperience(text);

      // niveau simple
      if (text.toLowerCase().includes("master")) niveau = "master";
      else if (text.toLowerCase().includes("licence")) niveau = "licence";

    } catch (err) {
      console.error("Erreur parsing PDF:", err.message);
    }
  }

  return {
    competences: skills.map(s => s.toLowerCase()),
    experience,
    niveau: niveau.toLowerCase()
  };
}

module.exports = extractCandidateData;