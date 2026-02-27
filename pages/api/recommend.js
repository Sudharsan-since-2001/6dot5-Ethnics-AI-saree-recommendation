import sarees from '../../data/sarees.js';

const OCCASION_FABRIC_RULES = {
  // 💍 Wedding Core
  "Wedding (own)": ["Kanchipuram SIlk Saree", "Bridal brocade silks", "Bridal Tissue Silk"],
  "Reception": ["Bridal Tissue Silk", "Bridal brocade silks", "Kanchipuram SIlk Saree"],
  "Sangeet ceremony": ["Contemporary silks", "Vegan Silk Sarees", "Silks Blended Sarees"],

  // 💐 Guests & Functions
  "Friend's wedding": ["Silks Blended Sarees", "Contemporary silks", "Vegan Silk Sarees"],
  "Relative's wedding": ["Kanchipuram SIlk Saree", "Silks Blended Sarees", "Contemporary silks"],
  "Wedding anniversary": ["Contemporary silks", "Vegan Silk Sarees"],
  "Baby shower": ["Silks Blended Sarees", "Vegan Comfort Sarees"],
  "Grihapravesh": ["Silks Blended Sarees", "Kanchipuram SIlk Saree"],
  "Family gatherings": ["Vegan Comfort Sarees", "Silks Blended Sarees"],

  // 🎉 Festivals
  "Pongal": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],
  "Diwali": ["Kanchipuram SIlk Saree", "Bridal brocade silks", "Silks Blended Sarees"],
  "Navratri": ["Contemporary silks", "Silks Blended Sarees"],
  "Durga Puja": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],
  "Onam": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],
  "Vishu": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],
  "Holi": ["Silks Blended Sarees", "Contemporary silks"],
  "Karva Chauth": ["Bridal Tissue Silk", "Kanchipuram SIlk Saree", "Vegan Silk Sarees"],
  "Raksha Bandhan": ["Silks Blended Sarees", "Vegan Silk Sarees"],
  "Ganesh Chaturthi": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],
  "Ugadi": ["Kanchipuram SIlk Saree", "Silks Blended Sarees"],

  // 🥂 Parties
  "Parties": ["Contemporary silks", "Vegan Silk Sarees"],
  "Cocktail parties": ["Contemporary silks", "Vegan Silk Sarees"],
  "Birthday celebrations": ["Contemporary silks", "Vegan Silk Sarees", "Silks Blended Sarees"],

  // 🏢 Office
  "Office parties": ["Vegan Comfort Sarees", "Silks Blended Sarees", "Contemporary silks"],
  "VC meetings": ["Vegan Comfort Sarees", "Contemporary silks"]
};

export default function handler(req, res) {
  const { occasion } = req.query;

  if (!occasion) {
    return res.status(400).json({ error: 'Occasion is required' });
  }

  const allowedFabrics = OCCASION_FABRIC_RULES[occasion];

  if (!allowedFabrics) {
    return res.status(400).json({ error: 'Rules not defined for this occasion' });
  }

  const recommendations = sarees
    .filter(saree => allowedFabrics.includes(saree.fabric))
    .sort((a, b) => b.price - a.price);

  res.status(200).json({
    occasion,
    recommendations
  });
}
