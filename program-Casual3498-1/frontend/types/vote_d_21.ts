import { PublicKey } from '@solana/web3.js';

export interface CandidateAccount {
  name: string;
  votes: number;
  bump: number;
}

export interface VoterAccount {
  authority: PublicKey;
  voted: boolean;
  votes: [PublicKey, PublicKey];
  bump: number;
}

export interface Candidate {
  name: string;
  pda: PublicKey;
  votes: number;
}

export const CANDIDATES = ['Alice', 'Bob', 'Charlie', 'Diana'] as const;
export type CandidateName = typeof CANDIDATES[number];


