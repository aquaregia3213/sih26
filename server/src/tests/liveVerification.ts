import { generateToken } from '../utils/authUtils';

async function verifyLiveEndpoints() {
  console.log('--- Verifying Live Recommendation Endpoint ---');

  // 1. Test Unauthenticated Request
  const unauthRes = await fetch('http://localhost:5000/api/recommendations/next');
  console.log(`1. Unauthenticated Request Status: ${unauthRes.status} (Expected: 401)`);
  const unauthBody = await unauthRes.json();
  console.log(`   Response Body:`, unauthBody);

  // 2. Generate token for valid user
  const token = generateToken({
    id: '00000000-0000-0000-0000-000000000000',
    email: 'elder_test@vanika.in',
    role: 'ELDER',
  });

  // 3. Test Authenticated Request
  const authRes = await fetch('http://localhost:5000/api/recommendations/next', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(`\n2. Authenticated Request Status: ${authRes.status} (Expected: 200)`);
  const authBody = await authRes.json();
  console.log(`   Response Body:`, JSON.stringify(authBody, null, 2));

  // 4. Test Forged userId Query Parameter Protection
  const forgedRes = await fetch('http://localhost:5000/api/recommendations/next?userId=11111111-1111-1111-1111-111111111111', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(`\n3. Forged userId Query Request Status: ${forgedRes.status} (Expected: 200 - uses token identity strictly)`);
  const forgedBody = await forgedRes.json();
  console.log(`   Response Data match: ${forgedBody.data.recommendedDifficulty === authBody.data.recommendedDifficulty}`);

  if (unauthRes.status === 401 && authRes.status === 200 && authBody.success === true && authBody.data.gameId) {
    console.log('\nLIVE ENDPOINT VERIFICATION SUCCESSFUL! 🎉');
  } else {
    console.error('\nLIVE ENDPOINT VERIFICATION FAILED!');
    process.exit(1);
  }
}

verifyLiveEndpoints().catch((err) => {
  console.error('Error during live endpoint verification:', err);
  process.exit(1);
});
