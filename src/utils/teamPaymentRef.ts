function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export function deriveTeamPaymentRef(teamId: string) {
  const normalized = teamId.trim().toLowerCase();
  const compactHex = normalized.replace(/-/g, "");

  if (/^[a-f0-9]{1,64}$/.test(compactHex)) {
    return `0x${compactHex.padStart(64, "0")}`;
  }

  const encoded = new TextEncoder().encode(normalized);
  return `0x${toHex(encoded).slice(0, 64).padEnd(64, "0")}`;
}
