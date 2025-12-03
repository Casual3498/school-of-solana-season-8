'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useVote } from '@/contexts/VoteContext';
import CandidateCard from './CandidateCard';
import { requestAirdrop, getBalance } from '@/utils/airdrop';

export default function VotingInterface() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { candidates, voterAccount, loading, voting, vote, initializeVoter } = useVote();
  
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [airdropping, setAirdropping] = useState(false);

  const handleSelectCandidate = (name: string) => {
    if (voterAccount?.voted) return;
    
    setError('');
    setSuccess('');

    if (selectedCandidates.includes(name)) {
      // Deselect
      setSelectedCandidates(selectedCandidates.filter(c => c !== name));
    } else if (selectedCandidates.length < 2) {
      // Select (max 2)
      setSelectedCandidates([...selectedCandidates, name]);
    } else {
      // Already have 2 selected, replace the first one
      setSelectedCandidates([selectedCandidates[1], name]);
    }
  };

  const handleVote = async () => {
    if (selectedCandidates.length !== 2) {
      setError('Please select exactly 2 candidates');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await vote(selectedCandidates[0], selectedCandidates[1]);
      setSuccess('Vote cast successfully! 🎉');
      setSelectedCandidates([]);
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote');
    }
  };

  const handleInitializeVoter = async () => {
    try {
      setError('');
      setSuccess('');
      await initializeVoter();
      setSuccess('Voter account initialized! You can now vote.');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize voter account');
    }
  };

  const handleAirdrop = async () => {
    if (!publicKey) return;
    
    try {
      setAirdropping(true);
      setError('');
      setSuccess('');
      
      const signature = await requestAirdrop(connection, publicKey, 2);
      setSuccess(`Airdropped 2 SOL! Signature: ${signature.slice(0, 8)}...`);
      
      // Update balance
      const newBalance = await getBalance(connection, publicKey);
      setBalance(newBalance);
    } catch (err: any) {
      setError(err.message || 'Failed to airdrop SOL');
    } finally {
      setAirdropping(false);
    }
  };

  // Load balance on mount and when publicKey changes
  useEffect(() => {
    if (publicKey && connection) {
      getBalance(connection, publicKey).then(setBalance).catch(console.error);
    }
  }, [publicKey, connection]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-center space-y-4">
          <svg className="w-24 h-24 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Connect Your Wallet
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect your Phantom wallet to participate in voting
          </p>
        </div>
        <WalletMultiButton />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading voting data...</p>
        </div>
      </div>
    );
  }

  const hasVoted = voterAccount?.voted;
  const needsInitialization = !voterAccount && connected;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Vote D-21
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Cast your votes for 2 candidates
        </p>
        {publicKey && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </p>
            {balance !== null && (
              <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Balance: {balance.toFixed(4)} SOL
                </p>
                {balance < 0.1 && (
                  <button
                    onClick={handleAirdrop}
                    disabled={airdropping}
                    className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
                  >
                    {airdropping ? '🪂 Airdropping...' : '🪂 Get SOL'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      {hasVoted && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-700 dark:text-blue-400 font-semibold">
              You have already voted! Thank you for participating.
            </p>
          </div>
        </div>
      )}

      {needsInitialization && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center space-y-4">
          <p className="text-yellow-700 dark:text-yellow-400">
            You need to initialize your voter account before voting.
          </p>
          <button
            onClick={handleInitializeVoter}
            disabled={voting}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
          >
            {voting ? 'Initializing...' : 'Initialize Voter Account'}
          </button>
        </div>
      )}

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.name}
            candidate={candidate}
            selected={selectedCandidates.includes(candidate.name)}
            disabled={hasVoted || needsInitialization}
            onSelect={() => handleSelectCandidate(candidate.name)}
          />
        ))}
      </div>

      {/* Vote Button */}
      {!hasVoted && !needsInitialization && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Selected: <span className="font-semibold">{selectedCandidates.length}</span> of 2
            </p>
            {selectedCandidates.length > 0 && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {selectedCandidates.join(' & ')}
              </p>
            )}
          </div>
          
          <button
            onClick={handleVote}
            disabled={selectedCandidates.length !== 2 || voting}
            className={`
              px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200
              ${selectedCandidates.length === 2 && !voting
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {voting ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Casting Vote...</span>
              </span>
            ) : (
              'Cast Your Vote'
            )}
          </button>
        </div>
      )}

      {/* Voting Stats */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Current Results
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {candidates.map((candidate) => (
            <div key={candidate.name} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.name}</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidate.votes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


