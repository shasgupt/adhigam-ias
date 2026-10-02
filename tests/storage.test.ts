import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getInitialSeedData, db } from '../src/db/storage.ts';

describe('Storage & Database Layer', () => {
  it('should initialize complete seed data with all core entities', () => {
    const seed = getInitialSeedData();
    assert.equal(seed.version, 1);
    assert.ok(Array.isArray(seed.users));
    assert.ok(seed.users.length >= 2, 'Must include admin and faculty accounts');
    assert.ok(seed.testSeries.length >= 1, 'Must include RISE 2.0 test series');
    assert.ok(seed.announcements.length >= 1, 'Must include announcements');
    assert.ok(seed.articles.length >= 1, 'Must include articles');
    assert.ok(seed.quizzes.length >= 1, 'Must include quizzes');
    assert.ok(seed.prompts.length >= 1, 'Must include mains prompts');
    assert.ok(seed.enquiries.length >= 1, 'Must include sample enquiries');
  });

  it('should have properly structured RISE 2.0 test series in database seed', () => {
    const seed = getInitialSeedData();
    const rise = seed.testSeries.find((t) => t.key === 'rise-2-0-sociology-optional');
    assert.ok(rise, 'RISE 2.0 must be present in database seed');
    assert.equal(rise.totalTests, 49);
    assert.equal(rise.fee, '₹8,900');
    assert.equal(rise.earlyBirdFee, '₹7,650');
    assert.equal(rise.existingStudentFee, '₹6,675');
    assert.equal(rise.schedule?.length, 49);
  });

  it('should provide database stats and export capability', () => {
    const stats = db.getStats();
    assert.ok(stats.storageEngine.includes('Persistent File Database'));
    assert.ok(typeof stats.counts.users === 'number');
    assert.ok(typeof stats.counts.testSeries === 'number');
    assert.ok(typeof stats.counts.enquiries === 'number');

    const exported = db.exportData();
    assert.ok(exported.users);
    assert.ok(exported.testSeries);
    assert.ok(exported.announcements);
  });

  it('should support safe in-memory mutations and save triggers', () => {
    const initialEnqCount = db.enquiries.length;
    const testEnq = {
      id: `test_enq_${Date.now()}`,
      referenceId: 'ADHIGAM-Q-TEST-9999',
      name: 'Test Aspirant',
      email: 'test.aspirant@example.com',
      phone: '+91 99999 88888',
      category: 'RISE 2.0 Enrolment',
      courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
      preferredMode: 'online' as const,
      message: 'Automated CI pipeline verification test enquiry.',
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };

    db.enquiries.unshift(testEnq);
    assert.equal(db.enquiries.length, initialEnqCount + 1);

    // Clean up test item
    const idx = db.enquiries.findIndex((e) => e.id === testEnq.id);
    if (idx !== -1) db.enquiries.splice(idx, 1);
    assert.equal(db.enquiries.length, initialEnqCount);
  });
});
