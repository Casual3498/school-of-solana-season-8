'use client';

import React from 'react';
import { Candidate } from '@/types/vote_d_21';

interface CandidateCardProps {
  candidate: Candidate;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export default function CandidateCard({ candidate, selected, disabled, onSelect }: CandidateCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
        ${selected 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
        }
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar */}
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold
          ${selected ? 'bg-purple-500 text-white' : 'bg-gradient-to-br from-purple-400 to-pink-400 text-white'}
        `}>
          {candidate.name[0]}
        </div>
        
        {/* Name */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {candidate.name}
        </h3>
        
        {/* Votes */}
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {candidate.votes}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {candidate.votes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
      </div>
    </div>
  );
}


