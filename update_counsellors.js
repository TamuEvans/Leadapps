const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'client/src/pages/Counselling.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Counsellors to update (starting from Gabriela Ramirez, ID 5)
const counsellorData = [
  { id: 5, costRange: "$90-120 per hour", rating: 4.6, reviewCount: 73 },
  { id: 6, costRange: "$95-140 per hour", rating: 4.8, reviewCount: 112 },
  { id: 7, costRange: "$120-180 per hour", rating: 5.0, reviewCount: 143 },
  { id: 8, costRange: "$100-150 per hour", rating: 4.7, reviewCount: 91 },
  { id: 9, costRange: "$80-110 per hour", rating: 4.5, reviewCount: 68 },
  { id: 10, costRange: "$90-130 per hour", rating: 4.8, reviewCount: 95 }
];

counsellorData.forEach(counsellor => {
  const idPattern = new RegExp(`id: ${counsellor.id},[\\s\\S]*?languages: \\[.*?\\],`, 'm');
  const replacement = `id: ${counsellor.id},[\\s\\S]*?languages: \\[.*?\\],\\s*costRange: "${counsellor.costRange}",\\s*rating: ${counsellor.rating},\\s*reviewCount: ${counsellor.reviewCount},`;
  
  // Find the counsellor entry
  const match = content.match(idPattern);
  if (match) {
    const matchedText = match[0];
    // Prepare replacement text by adding cost and rating fields
    const replacementText = matchedText + `\n    costRange: "${counsellor.costRange}",\n    rating: ${counsellor.rating},\n    reviewCount: ${counsellor.reviewCount},`;
    // Replace in content
    content = content.replace(matchedText, replacementText);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Counsellors updated successfully');
