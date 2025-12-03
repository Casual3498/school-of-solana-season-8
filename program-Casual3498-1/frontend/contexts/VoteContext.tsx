'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getProgram, getCandidatePDA, getVoterPDA } from '@/utils/anchor';
import { Candidate, CandidateAccount, VoterAccount, CANDIDATES } from '@/types/vote_d_21';

interface VoteContextType {
  candidates: Candidate[];
  voterAccount: VoterAccount | null;
  loading: boolean;
  voting: boolean;
  vote: (candidate1: string, candidate2: string) => Promise<void>;
  initializeVoter: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export function VoteProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voterAccount, setVoterAccount] = useState<VoterAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchCandidates = async () => {
    try {
      const candidatesData: Candidate[] = [];
      
      for (const name of CANDIDATES) {
        const [pda] = getCandidatePDA(name);
        
        try {
          const accountInfo = await connection.getAccountInfo(pda);
          
          if (accountInfo) {
            // Deserialize account data
            const data = accountInfo.data;
            // Skip discriminator (8 bytes)
            const nameLength = data.readUInt32LE(8);
            const candidateName = data.slice(12, 12 + nameLength).toString('utf-8');
            const votes = Number(data.readBigUInt64LE(12 + nameLength));
            
            candidatesData.push({
              name: candidateName,
              pda,
              votes,
            });
          } else {
            // Candidate not initialized yet
            candidatesData.push({
              name,
              pda,
              votes: 0,
            });
          }
        } catch (error) {
          console.error(`Error fetching candidate ${name}:`, error);
          candidatesData.push({
            name,
            pda,
            votes: 0,
          });
        }
      }
      
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchVoterAccount = async () => {
    if (!publicKey || !wallet) {
      setVoterAccount(null);
      return;
    }

    try {
      const program = getProgram(connection, wallet);
      const [voterPDA] = getVoterPDA(publicKey);
      
      try {
        const accountInfo = await connection.getAccountInfo(voterPDA);
        
        if (accountInfo) {
          // Deserialize voter account manually
          const data = accountInfo.data;
          const authority = new PublicKey(data.slice(8, 40));
          const voted = data[40] === 1;
          const vote1 = new PublicKey(data.slice(41, 73));
          const vote2 = new PublicKey(data.slice(73, 105));
          const bump = data[105];
          
          setVoterAccount({
            authority,
            voted,
            votes: [vote1, vote2],
            bump,
          });
        } else {
          setVoterAccount(null);
        }
      } catch (error) {
        // Voter account doesn't exist yet
        setVoterAccount(null);
      }
    } catch (error) {
      console.error('Error fetching voter account:', error);
      setVoterAccount(null);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchCandidates(), fetchVoterAccount()]);
    setLoading(false);
  };

  const initializeVoter = async () => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setVoting(true);
      const program = getProgram(connection, wallet);
      const [voterPDA] = getVoterPDA(publicKey);

      const { SystemProgram } = await import('@solana/web3.js');
      
      const tx = await program.methods
        .initializeVoter()
        .accountsPartial({
          voter: voterPDA,
          authority: publicKey,
          payer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Voter initialized:', tx);
      await refreshData();
    } catch (error) {
      console.error('Error initializing voter:', error);
      throw error;
    } finally {
      setVoting(false);
    }
  };

  const vote = async (candidate1Name: string, candidate2Name: string) => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected');
    }

    if (candidate1Name === candidate2Name) {
      throw new Error('Cannot vote for the same candidate twice');
    }

    try {
      setVoting(true);
      const program = getProgram(connection, wallet);
      const [voterPDA] = getVoterPDA(publicKey);
      const [candidate1PDA] = getCandidatePDA(candidate1Name);
      const [candidate2PDA] = getCandidatePDA(candidate2Name);

      const tx = await program.methods
        .vote([candidate1PDA, candidate2PDA])
        .accountsPartial({
          voter: voterPDA,
          candidate1: candidate1PDA,
          candidate2: candidate2PDA,
          authority: publicKey,
        })
        .rpc();

      console.log('Vote cast:', tx);
      await refreshData();
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    } finally {
      setVoting(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [publicKey, wallet, connection]);

  return (
    <VoteContext.Provider
      value={{
        candidates,
        voterAccount,
        loading,
        voting,
        vote,
        initializeVoter,
        refreshData,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}

export function useVote() {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
}

