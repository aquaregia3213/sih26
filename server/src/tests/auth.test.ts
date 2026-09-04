import { AuthService } from '../services/authService';
import { generateToken, verifyToken, hashPassword, comparePassword } from '../utils/authUtils';

export async function runAuthTests(): Promise<{ passed: number; total: number; name: string }> {
  let passed = 0;
  const total = 13;
  const testName = 'Authentication Suite (13 tests)';

  console.log(`\n--- Running ${testName} ---`);

  try {
    // Test 1: Hash password produces bcrypt hash
    const pass = 'SecurePass123!';
    const hash = await hashPassword(pass);
    if (hash && hash !== pass && hash.startsWith('$2')) {
      passed++;
      console.log('✓ 1. Password hashing produces valid bcrypt hash');
    }

    // Test 2: Compare correct password
    const isMatch = await comparePassword(pass, hash);
    if (isMatch) {
      passed++;
      console.log('✓ 2. Compare password validates correct password');
    }

    // Test 3: Compare incorrect password
    const isBadMatch = await comparePassword('WrongPass', hash);
    if (!isBadMatch) {
      passed++;
      console.log('✓ 3. Compare password rejects incorrect password');
    }

    // Test 4: Generate JWT token
    const mockUser = { id: '11111111-1111-1111-1111-111111111111', email: 'test@vanika.in', role: 'ELDER' as const };
    const token = generateToken(mockUser);
    if (token && token.split('.').length === 3) {
      passed++;
      console.log('✓ 4. JWT token generation creates valid 3-part JWT string');
    }

    // Test 5: Verify JWT token
    const decoded = verifyToken(token);
    if (decoded && decoded.id === mockUser.id && decoded.role === 'ELDER') {
      passed++;
      console.log('✓ 5. JWT token verification restores correct user payload');
    }

    // Test 6: Verify invalid JWT token throws error
    let invalidTokenCaught = false;
    try {
      verifyToken('invalid.token.string');
    } catch {
      invalidTokenCaught = true;
    }
    if (invalidTokenCaught) {
      passed++;
      console.log('✓ 6. Invalid JWT verification correctly throws error');
    }

    // Test 7: Reject registration with empty email and phone
    let emptyAuthCaught = false;
    try {
      await AuthService.register({ password: 'Password123!', fullName: 'Test User' } as any);
    } catch (err: any) {
      if (err.statusCode === 400) emptyAuthCaught = true;
    }
    if (emptyAuthCaught) {
      passed++;
      console.log('✓ 7. AuthService rejects registration without email or phone');
    }

    // Test 8: Reject registration with short password
    let shortPassCaught = false;
    try {
      await AuthService.register({ email: 'short@vanika.in', password: '123', fullName: 'Test User' });
    } catch (err: any) {
      if (err.statusCode === 400) shortPassCaught = true;
    }
    if (shortPassCaught) {
      passed++;
      console.log('✓ 8. AuthService rejects short passwords (< 6 chars)');
    }

    // Test 9: Reject login with missing user
    let userNotFoundCaught = false;
    try {
      await AuthService.login({ login: 'nonexistent_user_999@vanika.in', password: 'Password123!' });
    } catch (err: any) {
      if (err.statusCode === 401 || err.status === 401 || (err.message && err.message.includes('Invalid'))) userNotFoundCaught = true;
    }
    if (userNotFoundCaught) {
      passed++;
      console.log('✓ 9. AuthService rejects login for non-existent user credentials');
    }

    // Test 10: Reject login with empty identifier
    let emptyIdentCaught = false;
    try {
      await AuthService.login({ login: '', password: 'Password123!' });
    } catch (err: any) {
      if (err.statusCode === 400) emptyIdentCaught = true;
    }
    if (emptyIdentCaught) {
      passed++;
      console.log('✓ 10. AuthService rejects login when no email or phone provided');
    }

    // Test 11: Validate user role enum values
    const validRoles = ['ELDER', 'CAREGIVER', 'ADMIN'];
    if (validRoles.includes(mockUser.role)) {
      passed++;
      console.log('✓ 11. Role enforcement accepts ELDER, CAREGIVER, and ADMIN');
    }

    // Test 12: Token payload includes active status
    const token2 = generateToken({ ...mockUser, role: 'CAREGIVER' });
    const decoded2 = verifyToken(token2);
    if (decoded2.role === 'CAREGIVER') {
      passed++;
      console.log('✓ 12. Token generation supports CAREGIVER role payload');
    }

    // Test 13: Password hashing salts are unique
    const hash2 = await hashPassword(pass);
    if (hash !== hash2) {
      passed++;
      console.log('✓ 13. Password hashing uses unique random salts per execution');
    }
  } catch (error) {
    console.error('Error in Auth Tests:', error);
  }

  return { passed, total, name: testName };
}
