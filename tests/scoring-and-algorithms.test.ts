import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('UPSC Scoring & Business Logic Algorithms', () => {
  // UPSC Prelims Scoring Algorithm (2 marks per correct, -0.66 per incorrect)
  function calculatePrelimsScore(correctCount: number, incorrectCount: number): number {
    const raw = correctCount * 2 - incorrectCount * 0.66;
    return Math.max(0, Number(raw.toFixed(2)));
  }

  it('should calculate perfect score with 0 incorrect', () => {
    const score = calculatePrelimsScore(5, 0);
    assert.equal(score, 10);
  });

  it('should calculate correct UPSC negative marks penalty', () => {
    // 3 correct (6 marks), 2 incorrect (1.32 negative) => 4.68 marks
    const score = calculatePrelimsScore(3, 2);
    assert.equal(score, 4.68);
  });

  it('should floor negative scores to 0', () => {
    // 0 correct, 5 incorrect => 0 (not negative)
    const score = calculatePrelimsScore(0, 5);
    assert.equal(score, 0);
  });

  // Reference ID Generator Algorithm
  function generateReferenceId(randomSeed?: number): string {
    const digits = randomSeed ?? Math.floor(1000 + Math.random() * 9000);
    return `ADHIGAM-Q-${digits}`;
  }

  it('should generate valid formatted reference IDs', () => {
    const ref = generateReferenceId(7890);
    assert.equal(ref, 'ADHIGAM-Q-7890');
    assert.match(ref, /^ADHIGAM-Q-\d{4}$/);
  });

  // Enquiry Search & Match Algorithm
  it('should accurately match search queries by reference code, email, and phone', () => {
    const mockEnquiries = [
      {
        id: '1',
        referenceId: 'ADHIGAM-Q-1001',
        email: 'aspirant.one@gmail.com',
        phone: '+91 98111 22233',
      },
      {
        id: '2',
        referenceId: 'ADHIGAM-Q-2002',
        email: 'sociology.student@yahoo.co.in',
        phone: '+91 94444 55566',
      },
    ];

    const matchQuery = (query: string) => {
      const q = query.trim().toLowerCase();
      const numQuery = query.replace(/[^0-9]/g, '');
      return mockEnquiries.filter(
        (e) =>
          e.email.toLowerCase() === q ||
          e.referenceId.toLowerCase() === q ||
          (numQuery.length >= 7 && e.phone.replace(/[^0-9]/g, '').includes(numQuery))
      );
    };

    assert.equal(matchQuery('ADHIGAM-Q-1001').length, 1);
    assert.equal(matchQuery('aspirant.one@gmail.com').length, 1);
    assert.equal(matchQuery('9444455566').length, 1);
    assert.equal(matchQuery('nonexistent@domain.com').length, 0);
  });
});
