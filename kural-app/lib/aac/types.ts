export type AACState =
  | 'L1'
  | 'L2'
  | 'L3'
  | 'SENTENCES'
  | 'NUDGE'
  | 'KEYBOARD'
  | 'YESNO'
  | 'QUICK';

export interface ConversationEntry {
  id: string;
  speaker: 'robert' | 'caregiver';
  text: string;
  timestamp: Date;
}

export interface AACStateData {
  state: AACState;
  l1Key?: string;
  l2Key?: string;
  l3Key?: string;
  intentPath?: string;
  sentences?: string[];
  previousOptions?: string[];
}
