export interface DateGateConfig {
  eyebrow: string;
  question: string;
  hint: string;
  submitLabel: string;
  wrongMessage: string;
  successMessage: string;
}

export interface DeckCard {
  id: string;
  /** Фото: public/photos/photo.jpg → "/photos/photo.jpg" */
  image?: string;
  caption: string;
  note?: string;
}

export interface SiteContent {
  herName: string;
  togetherSince: string;
  introLine: string;
  gate: DateGateConfig;
  cards: DeckCard[];
}
