export default {
  functionName: 'hashPassword',
  prompt: `// Write an async JavaScript function 'hashPassword' that hashes a password using the scrypt key derivation function.
// - The function must accept a password string and a salt string (both as regular strings, not Uint8Array).
// - You MUST use dynamic import() to load the 'scrypt-js' library from a CDN.
// - Convert the password and salt strings to Uint8Array using TextEncoder before passing to scrypt.
// - Use these scrypt parameters: N=1024, r=8, p=1, dkLen=32 (these are relatively fast parameters for testing).
// - The scrypt function from scrypt-js returns a Promise that resolves to a Uint8Array.
// - Convert the resulting Uint8Array hash to a hexadecimal string.
// - Return the hexadecimal hash string (lowercase).
// - Handle the async nature of scrypt properly using await.`,
  runTest: async (hashPassword) => {
    const assert = {
      strictEqual: (a, e, m) => { if (a !== e) throw new Error(m || `FAIL: ${a} !== ${e}`) },
      ok: (v, m) => { if (!v) throw new Error(m) },
    };
    
    const password = 'testPassword123';
    const salt = 'randomSalt456';
    
    const hash = await hashPassword(password, salt);
    
    assert.ok(typeof hash === 'string', 'Test Failed: Hash should be a string.');
    assert.strictEqual(hash.length, 64, 'Test Failed: Hash should be 64 hex characters (32 bytes).');
    assert.ok(/^[0-9a-f]{64}$/.test(hash), 'Test Failed: Hash should be lowercase hexadecimal.');
    
    const hash2 = await hashPassword(password, salt);
    assert.strictEqual(hash, hash2, 'Test Failed: Same inputs should produce same hash.');
    
    const hash3 = await hashPassword(password, 'differentSalt');
    assert.ok(hash !== hash3, 'Test Failed: Different salts should produce different hashes.');
  }
};
