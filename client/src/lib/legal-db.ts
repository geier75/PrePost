export interface CountryProfile {
  code: string;
  name: string;
  freedomScore: number; // 0-100
  risks: {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    penalty: string;
  }[];
  culturalNorms: string[];
}

export const legalDatabase: Record<string, CountryProfile> = {
  DE: {
    code: 'DE',
    name: 'Germany',
    freedomScore: 75,
    risks: [
      {
        category: 'Hate Speech (Volksverhetzung)',
        description: 'Incitement to hatred against segments of the population.',
        severity: 'critical',
        penalty: 'Up to 5 years imprisonment'
      },
      {
        category: 'Defamation (Beleidigung)',
        description: 'Insulting another person.',
        severity: 'high',
        penalty: 'Up to 2 years imprisonment or fine'
      },
      {
        category: 'GDPR Violation',
        description: 'Sharing personal data without consent.',
        severity: 'high',
        penalty: 'Fines up to €20 million'
      },
      {
        category: 'Nazi Symbols',
        description: 'Displaying unconstitutional symbols.',
        severity: 'critical',
        penalty: 'Up to 3 years imprisonment'
      }
    ],
    culturalNorms: [
      'High value on privacy',
      'Direct communication style',
      'Strict separation of professional and private life'
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    freedomScore: 90,
    risks: [
      {
        category: 'Defamation (Libel)',
        description: 'False statement damaging a reputation.',
        severity: 'medium',
        penalty: 'Civil lawsuits (monetary damages)'
      },
      {
        category: 'True Threats',
        description: 'Statements where the speaker means to communicate a serious expression of an intent to commit an act of unlawful violence.',
        severity: 'critical',
        penalty: 'Federal prison time'
      },
      {
        category: 'Copyright Infringement',
        description: 'Using protected works without permission.',
        severity: 'medium',
        penalty: 'Statutory damages up to $150,000'
      }
    ],
    culturalNorms: [
      'High value on freedom of speech',
      'Individualistic culture',
      'Litigious society'
    ]
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    freedomScore: 80,
    risks: [
      {
        category: 'Malicious Communications',
        description: 'Sending indecent or grossly offensive messages.',
        severity: 'high',
        penalty: 'Up to 2 years imprisonment'
      },
      {
        category: 'Defamation',
        description: 'Statement that causes serious harm to reputation.',
        severity: 'high',
        penalty: 'Unlimited damages'
      }
    ],
    culturalNorms: [
      'Politeness and indirectness',
      'Self-deprecating humor',
      'Strict libel laws'
    ]
  },
  CN: {
    code: 'CN',
    name: 'China',
    freedomScore: 10,
    risks: [
      {
        category: 'Political Criticism',
        description: 'Criticizing the government or party leadership.',
        severity: 'critical',
        penalty: 'Imprisonment, forced disappearance'
      },
      {
        category: 'Rumors',
        description: 'Spreading "false rumors" that disrupt social order.',
        severity: 'high',
        penalty: 'Up to 7 years imprisonment'
      },
      {
        category: 'Separatism',
        description: 'Advocating for independence of regions.',
        severity: 'critical',
        penalty: 'Life imprisonment'
      }
    ],
    culturalNorms: [
      'Social harmony priority',
      'Respect for authority',
      'Face (Mianzi) culture'
    ]
  }
};

export const getCountryProfile = (code: string) => legalDatabase[code] || legalDatabase['US'];
