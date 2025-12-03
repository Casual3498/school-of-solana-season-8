'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import VotingInterface from '@/components/VotingInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vote D-21</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Solana Voting dApp</p>
              </div>
            </div>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <VotingInterface />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built with <span className="text-red-500">♥</span> on Solana
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Powered by Anchor Framework
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Learn about Solana
              </a>
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Get Phantom Wallet
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
