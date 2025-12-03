import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function requestAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number = 2
): Promise<string> {
  try {
    // Request airdrop
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return signature;
  } catch (error: any) {
    throw new Error(`Airdrop failed: ${error.message}`);
  }
}

export async function getBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

