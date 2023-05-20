/* eslint-disable no-undef */
export const generateCandidates = async (numCandidates) => {
    const initialInput = `${Math.random()}${Date.now()}`;
    let hash = new TextEncoder().encode(initialInput);
    const candidates = [];
    for (let i = 0; i < numCandidates; i++) {
        hash = await window.crypto.subtle.digest('SHA-256', hash);
        const hashArray = Array.from(new Uint8Array(hash));
        const hexValue = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const bigIntHash = BigInt(`0x${hexValue}`);
        candidates.push(bigIntHash);
        hash = new TextEncoder().encode(bigIntHash.toString());
    }
    return candidates;
};