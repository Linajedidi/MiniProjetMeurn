function calculateScore(offre, candidat) {
  let score = 0;

  //  COMPÉTENCES (50%)
  const required = offre.competences || [];
  const userSkills = candidat.competences || [];

  const matched = required.filter(skill =>
    userSkills.includes(skill.toLowerCase())
  );

  const skillsScore = required.length
    ? (matched.length / required.length) * 50
    : 0;

  //  EXPÉRIENCE (30%)
  let expScore = 0;
  if (offre.experience) {
    const ratio = candidat.experience / offre.experience;
    expScore = Math.min(ratio, 1) * 30;
  }

  //  NIVEAU (20%)
  let niveauScore = 0;
  if (offre.niveau === candidat.niveau) {
    niveauScore = 20;
  }

  return Math.round(skillsScore + expScore + niveauScore);
}

module.exports = calculateScore;