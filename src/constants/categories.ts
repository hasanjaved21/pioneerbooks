export const BOOK_CATEGORIES = [
  'Abstract of labour',
  'Accounts Registers',
  'ACR Forms',
  'Agricultural Laws',
  'Anti-Corruption',
  'Anti-Terrorism Laws',
  'Arbitration Laws',
  'Arms & Explosives',
  'Assistant Collector',
  'Banking',
  'Bare Acts',
  'Building / Land laws',
  'Cantonment Laws',
  'Case Law Digest',
  'Charities',
  'Children Laws',
  'Christian Laws',
  'Citizenship',
  'Civil Judge Exam',
  'Civil Laws',
  'Code of Civil',
  'Code of Criminal',
  'Constitutional Laws',
  'Consumer Protection',
  'Contempt of Court',
  'Contract Law',
  'Control of Narcotics',
  'Conveyance, Deeds',
  'Cooperative Society',
  'Corporate Compliance',
  'Corporate Laws',
  'Court Fees & Suit',
  'Court Rules',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export const REMOVED_CATEGORIES = [
  'Quran',
  'Hadith',
  'History',
  'Kids',
  'Fiqh',
  'Spirituality',
] as const;

// Featured law categories for homepage highlights
export const FEATURED_HOME_CATEGORIES = [
  { name: 'Bare Acts', icon: '⚖️', desc: 'Authoritative statutory texts & official amendments' },
  { name: 'Code of Civil', icon: '🏛️', desc: 'Civil Procedure Code (CPC), rules & commentary' },
  { name: 'Code of Criminal', icon: '📑', desc: 'CrPC, Pakistan Penal Code & Criminal trial laws' },
  { name: 'Constitutional Laws', icon: '📜', desc: 'Constitution of Pakistan & apex court rulings' },
  { name: 'Civil Judge Exam', icon: '🎓', desc: 'Comprehensive guides for judicial & bar examinations' },
  { name: 'Corporate Laws', icon: '💼', desc: 'Companies Act, SECP regulations & business compliance' },
  { name: 'Case Law Digest', icon: '📚', desc: 'PLD, SCMR, CLC, PCrLJ law digests & citations' },
  { name: 'Conveyance, Deeds', icon: '✍️', desc: 'Standard legal drafting, agreements & registrations' },
];
