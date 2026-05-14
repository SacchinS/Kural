export const TILE_HIERARCHY: Record<string, Record<string, string[] | null> | null> = {
  'I need...': {
    Comfort: ['Adjust position', 'Too hot', 'Too cold', 'Pain relief', 'Something else'],
    Food: ['Hungry', 'Thirsty', 'Water', 'Specific food', 'Something else'],
    Help: ['Bathroom', 'Medication', 'Emergency', 'Move me', 'Something else'],
    Entertainment: ['TV', 'Music', 'Read to me', 'Phone call', 'Something else'],
    Rest: ['Tired', 'Sleep now', 'Lights off', 'Quiet please', 'Something else'],
    'Something else': null,
  },
  'I feel...': {
    Physical: ['Pain', 'Nauseous', 'Breathless', 'Uncomfortable', 'Good actually'],
    Emotional: ['Happy', 'Sad', 'Frustrated', 'Grateful', 'Scared'],
    'About today': ['Good day', 'Hard day', 'Bored', 'Anxious', 'Content'],
    'Something else': null,
  },
  'Talk about...': {
    Family: ['Wife', 'Daughter', 'Son', 'Everyone', 'Something else'],
    Memories: ['Childhood', 'Work', 'Travel', 'Something funny', 'Something else'],
    'Current events': ['News', 'Sports', 'Weather', 'Something else'],
    'My condition': ['How I\'m doing', 'Treatment', 'Concerns', 'Questions for doctor', 'Something else'],
    'Something else': null,
  },
  Question: {
    'About my care': ['What\'s next?', 'When is my appointment?', 'Who is coming today?', 'What medications?', 'Something else'],
    'About family': ['Where is everyone?', 'Has anyone called?', 'When is Sarah coming?', 'Something else'],
    General: ['What time is it?', 'What day is it?', 'What\'s for dinner?', 'Something else'],
    'Something else': null,
  },
  'Yes / No': {
    Yes: null,
    No: null,
    Maybe: null,
    'I don\'t know': null,
    'Please repeat': null,
  },
  'Quick phrase': {
    Greetings: ['Good morning', 'Good night', 'Hello', 'Goodbye', 'How are you?'],
    Appreciation: ['Thank you', 'I love you', 'I appreciate you', 'You\'re doing great'],
    Needs: ['I\'m okay', 'I need a moment', 'Give me a minute', 'Not right now'],
    'Something else': null,
  },
};

export const OFFLINE_FALLBACK: Record<string, string[]> = {
  'I need... → Comfort': [
    'I need to be repositioned.',
    'I\'m uncomfortable right now.',
    'Can you help me adjust?',
  ],
  'I need... → Food': [
    'I\'m thirsty.',
    'I\'d like some water please.',
    'I\'m hungry.',
  ],
  'I need... → Help': [
    'I need help.',
    'Please get someone.',
    'This is urgent.',
  ],
  'I feel... → Physical': [
    'I\'m in pain.',
    'I\'m having trouble breathing.',
    'I don\'t feel well.',
  ],
  'I feel... → Emotional': [
    'I\'m feeling sad.',
    'I\'m frustrated.',
    'I\'m grateful for you.',
  ],
  'Talk about... → Family': [
    'I\'ve been thinking about the family.',
    'How is everyone doing?',
    'I miss everyone.',
  ],
};

export const ERROR_FALLBACK = [
  'I need help.',
  'Please get someone.',
  'I\'m trying to communicate.',
];

export const NUDGE_OPTIONS = [
  'More casual',
  'More urgent',
  'Shorter',
  'Funnier',
  'Different topic',
  'Manual input',
];

export const KEYBOARD_GROUPS = [
  'AEIOU',
  'STNR',
  'LDHC',
  'MBPWF',
  'GYPJ',
  'KVQXZ',
];
