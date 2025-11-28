export interface GeneratedImage {
  id: string;
  originalImage: string; // Base64
  generatedImage: string; // Base64
  prompt: string;
  timestamp: number;
  status: 'loading' | 'success' | 'error';
  error?: string;
  category: 'edit' | 'mockup';
  aspectRatio: AspectRatio;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export enum MarketingScenario {
  COFFEE_MUG = 'Coffee Mug',
  BILLBOARD = 'Billboard',
  T_SHIRT = 'T-Shirt',
  SOCIAL_MEDIA = 'Instagram Post',
  MAGAZINE = 'Magazine Spread',
  CUSTOM = 'Custom',
}

export interface ScenarioConfig {
  id: string;
  label: string;
  promptTemplate: string;
  icon: string;
}