#!/bin/bash

# Script to airdrop SOL to a wallet address on localhost
# Usage: ./scripts/airdrop-wallet.sh <WALLET_ADDRESS>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a wallet address"
    echo "Usage: ./scripts/airdrop-wallet.sh <WALLET_ADDRESS>"
    exit 1
fi

WALLET_ADDRESS=$1
AMOUNT=10

echo "🪂 Airdropping $AMOUNT SOL to $WALLET_ADDRESS..."

solana airdrop $AMOUNT $WALLET_ADDRESS --url http://127.0.0.1:8899

if [ $? -eq 0 ]; then
    echo "✅ Airdrop successful!"
    echo ""
    echo "Checking balance..."
    solana balance $WALLET_ADDRESS --url http://127.0.0.1:8899
else
    echo "❌ Airdrop failed"
    exit 1
fi

