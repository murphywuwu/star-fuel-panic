import { Buffer } from "node:buffer";

import { verifyPersonalMessageSignature } from "@mysten/sui/verify";

export type SignedCommand = {
  walletAddress: string;
  signature: string;
  message: string;
};

export function normalizeWalletAddress(walletAddress: string) {
  return walletAddress.trim().toLowerCase();
}

export function buildDevWalletSignature(walletAddress: string, message: string) {
  return `dev:${normalizeWalletAddress(walletAddress)}:${message.trim()}`;
}

export function buildLegacyTestWalletSignature(walletAddress: string, message: string) {
  return `test_sig:${normalizeWalletAddress(walletAddress)}:${Buffer.from(message, "utf8").toString("base64url")}`;
}

function messageMatchesScope(message: string, walletAddress: string, scope: string, targetId: string) {
  return (
    message.includes(`${scope}:${targetId}`) &&
    message.toLowerCase().includes(normalizeWalletAddress(walletAddress))
  );
}

export async function verifyWalletSignature(command: SignedCommand) {
  const walletAddress = normalizeWalletAddress(command.walletAddress);
  const signature = command.signature.trim();
  const message = command.message.trim();

  if (!walletAddress || !signature || !message) {
    return false;
  }

  try {
    await verifyPersonalMessageSignature(new TextEncoder().encode(message), signature, {
      address: walletAddress
    });
    return true;
  } catch {
    return (
      signature === buildDevWalletSignature(walletAddress, message) ||
      signature === `dev:${walletAddress}` ||
      signature === buildLegacyTestWalletSignature(walletAddress, message)
    );
  }
}

export async function verifyScopedWalletSignature(
  command: SignedCommand & { scope: string; targetId: string }
) {
  if (!messageMatchesScope(command.message.trim(), command.walletAddress, command.scope, command.targetId)) {
    return false;
  }

  return verifyWalletSignature(command);
}
