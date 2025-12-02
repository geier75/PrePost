/**
 * Country-Specific Legal Risk Database
 * Comprehensive legal frameworks and risk factors by country
 */

export interface LegalRisk {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  examples: string[];
  penalties: string;
}

export interface CountryLegalProfile {
  country: string;
  countryCode: string;
  freedomOfSpeechScore: number; // 0-100, higher = more freedom
  risks: LegalRisk[];
  culturalNorms: string[];
  redFlags: string[];
  commonPenalties: string[];
}

export const COUNTRY_LEGAL_PROFILES: Record<string, CountryLegalProfile> = {
  DE: {
    country: 'Germany',
    countryCode: 'DE',
    freedomOfSpeechScore: 75,
    risks: [
      {
        category: 'Hate Speech (Volksverhetzung)',
        severity: 'critical',
        description: 'Incitement to hatred against groups based on nationality, ethnicity, religion, or other characteristics',
        examples: [
          'Denying or trivializing the Holocaust',
          'Calling for violence against minorities',
          'Using Nazi symbols or slogans'
        ],
        penalties: 'Up to 5 years imprisonment, fines up to €50,000'
      },
      {
        category: 'Defamation (Beleidigung)',
        severity: 'high',
        description: 'Insulting or defaming individuals, including public figures',
        examples: [
          'Calling someone a criminal without proof',
          'Public insults against politicians',
          'False accusations damaging reputation'
        ],
        penalties: 'Up to 2 years imprisonment or fines'
      },
      {
        category: 'Data Protection (GDPR)',
        severity: 'high',
        description: 'Violating privacy rights by sharing personal data without consent',
        examples: [
          'Posting photos of others without permission',
          'Sharing private messages publicly',
          'Doxxing (revealing personal information)'
        ],
        penalties: 'Fines up to €20 million or 4% of annual turnover'
      },
      {
        category: 'Copyright Infringement',
        severity: 'medium',
        description: 'Using copyrighted content without permission',
        examples: [
          'Sharing music, videos, or images without rights',
          'Using brand logos without authorization'
        ],
        penalties: 'Cease and desist, fines, damages'
      }
    ],
    culturalNorms: [
      'Avoid references to Nazi Germany',
      'Be respectful of historical sensitivity (WWII, Holocaust)',
      'Privacy is highly valued - don\'t share others\' info',
      'Professional tone expected in business contexts'
    ],
    redFlags: [
      'Holocaust denial',
      'Nazi symbols (swastika, SS runes)',
      'Racial slurs',
      'Calls for violence',
      'Personal data of others',
      'Unverified accusations'
    ],
    commonPenalties: [
      'Criminal prosecution',
      'Fines (€300 - €50,000+)',
      'Imprisonment (up to 5 years)',
      'Civil lawsuits for damages',
      'Account suspension'
    ]
  },

  US: {
    country: 'United States',
    countryCode: 'US',
    freedomOfSpeechScore: 90,
    risks: [
      {
        category: 'Defamation',
        severity: 'high',
        description: 'False statements harming someone\'s reputation',
        examples: [
          'Accusing someone of a crime they didn\'t commit',
          'False business reviews with malicious intent',
          'Spreading false rumors about public figures'
        ],
        penalties: 'Civil lawsuits, damages up to millions of dollars'
      },
      {
        category: 'True Threats',
        severity: 'critical',
        description: 'Statements expressing intent to commit violence',
        examples: [
          'Threatening to harm specific individuals',
          'School shooting threats',
          'Bomb threats'
        ],
        penalties: 'Federal crime, up to 5 years imprisonment'
      },
      {
        category: 'Harassment',
        severity: 'high',
        description: 'Repeated unwanted communication causing distress',
        examples: [
          'Cyberbullying',
          'Stalking behavior online',
          'Revenge porn'
        ],
        penalties: 'Restraining orders, criminal charges, imprisonment'
      },
      {
        category: 'Copyright Infringement (DMCA)',
        severity: 'medium',
        description: 'Using copyrighted material without permission',
        examples: [
          'Posting movies, music, or TV shows',
          'Using photos without attribution'
        ],
        penalties: 'DMCA takedowns, fines up to $150,000 per work'
      }
    ],
    culturalNorms: [
      'First Amendment protects most speech',
      'Political criticism is generally protected',
      'Be cautious with threats or harassment',
      'Respect intellectual property'
    ],
    redFlags: [
      'Direct threats of violence',
      'Doxxing',
      'Revenge porn',
      'False accusations',
      'Copyrighted content'
    ],
    commonPenalties: [
      'Civil lawsuits',
      'Damages (can be millions)',
      'Criminal charges for threats',
      'Account bans',
      'Restraining orders'
    ]
  },

  CN: {
    country: 'China',
    countryCode: 'CN',
    freedomOfSpeechScore: 15,
    risks: [
      {
        category: 'Political Criticism',
        severity: 'critical',
        description: 'Criticism of government, CCP, or leadership',
        examples: [
          'Criticizing Xi Jinping or CCP policies',
          'Discussing Tiananmen Square',
          'Supporting Hong Kong protests',
          'Mentioning Taiwan independence'
        ],
        penalties: 'Imprisonment, forced disappearance, re-education camps'
      },
      {
        category: 'Spreading Rumors',
        severity: 'critical',
        description: 'Sharing unverified information, especially about government',
        examples: [
          'Unverified news about disasters',
          'Information about epidemics',
          'Economic rumors'
        ],
        penalties: 'Up to 7 years imprisonment'
      },
      {
        category: 'Separatism',
        severity: 'critical',
        description: 'Supporting independence movements',
        examples: [
          'Tibet independence',
          'Xinjiang separatism',
          'Taiwan independence',
          'Hong Kong democracy'
        ],
        penalties: 'Long-term imprisonment, life sentence'
      },
      {
        category: 'Religious Content',
        severity: 'high',
        description: 'Unauthorized religious activities or content',
        examples: [
          'Falun Gong references',
          'Unauthorized Christian content',
          'Islamic religious content'
        ],
        penalties: 'Detention, imprisonment'
      }
    ],
    culturalNorms: [
      'Avoid all political topics',
      'Never criticize government or leadership',
      'Don\'t discuss sensitive historical events',
      'Respect censorship guidelines'
    ],
    redFlags: [
      'Tiananmen Square',
      'Xi Jinping criticism',
      'CCP criticism',
      'Taiwan independence',
      'Hong Kong protests',
      'Falun Gong',
      'Winnie the Pooh (Xi comparison)'
    ],
    commonPenalties: [
      'Account deletion',
      'Police interrogation',
      'Detention',
      'Imprisonment (years to life)',
      'Forced disappearance'
    ]
  },

  GB: {
    country: 'United Kingdom',
    countryCode: 'GB',
    freedomOfSpeechScore: 70,
    risks: [
      {
        category: 'Malicious Communications',
        severity: 'high',
        description: 'Sending grossly offensive, indecent, or menacing messages',
        examples: [
          'Racist or homophobic slurs',
          'Threats of violence',
          'Grossly offensive jokes'
        ],
        penalties: 'Up to 2 years imprisonment, unlimited fines'
      },
      {
        category: 'Harassment',
        severity: 'high',
        description: 'Causing alarm or distress through communications',
        examples: [
          'Persistent unwanted messages',
          'Cyberbullying',
          'Revenge porn'
        ],
        penalties: 'Up to 6 months imprisonment, fines'
      },
      {
        category: 'Defamation',
        severity: 'medium',
        description: 'Publishing false statements damaging reputation',
        examples: [
          'False accusations',
          'Libel in written posts'
        ],
        penalties: 'Civil damages, injunctions'
      }
    ],
    culturalNorms: [
      'Politeness valued',
      'Avoid offensive language',
      'Respect privacy',
      'Professional in business contexts'
    ],
    redFlags: [
      'Racist language',
      'Homophobic slurs',
      'Threats',
      'Grossly offensive content',
      'Revenge porn'
    ],
    commonPenalties: [
      'Police investigation',
      'Criminal charges',
      'Imprisonment',
      'Fines',
      'Civil lawsuits'
    ]
  },

  AE: {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    freedomOfSpeechScore: 25,
    risks: [
      {
        category: 'Criticism of Rulers',
        severity: 'critical',
        description: 'Any criticism of UAE rulers or government',
        examples: [
          'Criticizing Sheikh Mohammed',
          'Questioning government policies',
          'Discussing human rights issues'
        ],
        penalties: 'Imprisonment, deportation, heavy fines'
      },
      {
        category: 'Religious Insults',
        severity: 'critical',
        description: 'Insulting Islam or Islamic values',
        examples: [
          'Mocking Islamic practices',
          'Blasphemy',
          'Promoting other religions'
        ],
        penalties: 'Up to 10 years imprisonment, deportation'
      },
      {
        category: 'Immoral Content',
        severity: 'high',
        description: 'Content violating Islamic moral standards',
        examples: [
          'Nudity or sexual content',
          'Alcohol promotion',
          'LGBTQ+ content',
          'Extramarital relationships'
        ],
        penalties: 'Fines up to AED 500,000, imprisonment, deportation'
      },
      {
        category: 'Cybercrime Law Violations',
        severity: 'high',
        description: 'Broad cybercrime laws covering many online activities',
        examples: [
          'VPN usage for illegal purposes',
          'Spreading rumors',
          'Defamation online'
        ],
        penalties: 'Heavy fines, imprisonment'
      }
    ],
    culturalNorms: [
      'Respect Islamic values',
      'Never criticize rulers or government',
      'Avoid political topics',
      'Conservative dress and behavior',
      'No LGBTQ+ content',
      'Respect Ramadan'
    ],
    redFlags: [
      'Ruler criticism',
      'Religious insults',
      'Sexual content',
      'LGBTQ+ topics',
      'Alcohol',
      'Political criticism',
      'Human rights discussions'
    ],
    commonPenalties: [
      'Deportation',
      'Imprisonment',
      'Fines (AED 50,000 - 3,000,000)',
      'Travel bans',
      'Account deletion'
    ]
  },

  RU: {
    country: 'Russia',
    countryCode: 'RU',
    freedomOfSpeechScore: 20,
    risks: [
      {
        category: 'Discrediting the Military',
        severity: 'critical',
        description: 'Criticism of Russian military or "special military operation"',
        examples: [
          'Calling Ukraine conflict a "war"',
          'Criticizing military actions',
          'Anti-war statements'
        ],
        penalties: 'Up to 15 years imprisonment'
      },
      {
        category: 'Extremism',
        severity: 'critical',
        description: 'Broad definition including opposition activities',
        examples: [
          'Supporting opposition leaders',
          'Organizing protests',
          'Criticizing government'
        ],
        penalties: 'Up to 10 years imprisonment'
      },
      {
        category: 'LGBTQ+ "Propaganda"',
        severity: 'high',
        description: 'Any positive mention of LGBTQ+ topics',
        examples: [
          'Supporting LGBTQ+ rights',
          'Pride content',
          'Same-sex relationships'
        ],
        penalties: 'Fines up to 10 million rubles, deportation'
      },
      {
        category: 'Foreign Agent Law',
        severity: 'high',
        description: 'Receiving foreign funding or support',
        examples: [
          'Working with foreign NGOs',
          'Foreign media collaboration'
        ],
        penalties: 'Fines, restrictions, imprisonment'
      }
    ],
    culturalNorms: [
      'Avoid political criticism',
      'Don\'t discuss Ukraine conflict',
      'No LGBTQ+ content',
      'Patriotic tone expected',
      'Respect Orthodox Church'
    ],
    redFlags: [
      'Anti-war statements',
      'Military criticism',
      'Putin criticism',
      'LGBTQ+ content',
      'Opposition support',
      'Protest organization'
    ],
    commonPenalties: [
      'Imprisonment (up to 15 years)',
      'Heavy fines',
      'Forced disappearance',
      'Account blocking',
      'Travel bans'
    ]
  }
};

/**
 * Get legal profile for a country
 */
export function getCountryLegalProfile(countryCode: string): CountryLegalProfile {
  return COUNTRY_LEGAL_PROFILES[countryCode] || COUNTRY_LEGAL_PROFILES.US; // Default to US
}

/**
 * Get all supported countries
 */
export function getSupportedCountries(): Array<{ code: string; name: string; score: number }> {
  return Object.values(COUNTRY_LEGAL_PROFILES).map(profile => ({
    code: profile.countryCode,
    name: profile.country,
    score: profile.freedomOfSpeechScore
  }));
}

/**
 * Detect high-risk keywords for a country
 */
export function detectRiskyKeywords(content: string, countryCode: string): string[] {
  const profile = getCountryLegalProfile(countryCode);
  const lowerContent = content.toLowerCase();
  
  return profile.redFlags.filter(flag => 
    lowerContent.includes(flag.toLowerCase())
  );
}
