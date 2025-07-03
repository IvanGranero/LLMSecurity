export interface ScoreEntry {
  submissionDate: string | Date; // Updated to match backend schema
  score: number;
}

export interface User {
  id: string; // Changed to string since MongoDB uses ObjectId
  username: string;
  userCategory: string;
  sessionToken?: string; // Made optional if not always provided
  totalScore: number; // Added to reflect the total score field in your schema
  scores: ScoreEntry[]; // Matches backend structure instead of `score_timeline`
}
