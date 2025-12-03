import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { IDL, VoteD21 } from '../types/idl';

export const PROGRAM_ID = new PublicKey('7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN');

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  
  return new Program<VoteD21>(IDL as VoteD21, provider);
}

export function getCandidatePDA(name: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('candidate'), Buffer.from(name)],
    PROGRAM_ID
  );
}

export function getVoterPDA(authority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('voter'), authority.toBuffer()],
    PROGRAM_ID
  );
}

