import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  RISE_49_TEST_SCHEDULE,
  INSTITUTE_CONFIG,
} from '../src/data/instituteConfig.ts';

describe('Institute Configuration & RISE 2.0 Schedule', () => {
  it('should have valid institute contact and academy metadata', () => {
    assert.equal(INSTITUTE_CONFIG.name, 'ADHIGAM IAS');
    assert.ok(INSTITUTE_CONFIG.contact.email.includes('@'));
    assert.equal(INSTITUTE_CONFIG.contact.telegram, '@adhigamias1');
    assert.ok(INSTITUTE_CONFIG.contact.telegramLink.startsWith('https://t.me/'));
    assert.ok(INSTITUTE_CONFIG.contact.website.startsWith('https://'));
  });

  it('should have exact 49-test schedule in sequential order (Tests 1 to 49)', () => {
    assert.equal(RISE_49_TEST_SCHEDULE.length, 49, 'Schedule must contain exactly 49 tests');

    RISE_49_TEST_SCHEDULE.forEach((item, index) => {
      const expectedTestNum = index + 1;
      assert.equal(
        item.testNumber,
        expectedTestNum,
        `Test at index ${index} should have testNumber ${expectedTestNum}`
      );
      assert.ok(item.date, `Test ${item.testNumber} must have a valid date`);
      assert.ok(item.day, `Test ${item.testNumber} must specify day of week`);
      assert.ok(['Monday', 'Wednesday', 'Friday'].includes(item.day), `Test day should be Monday, Wednesday, or Friday`);
      assert.ok(item.paper, `Test ${item.testNumber} must specify Paper I, Paper II, or Comprehensive`);
      assert.ok(item.section, `Test ${item.testNumber} must have section title`);
      assert.ok(item.coverage, `Test ${item.testNumber} must detail topic coverage`);
    });
  });

  it('should correctly partition Paper I, Paper II, and Comprehensive tests', () => {
    const paper1Tests = RISE_49_TEST_SCHEDULE.filter((t) => t.testNumber >= 1 && t.testNumber <= 22);
    const paper2Tests = RISE_49_TEST_SCHEDULE.filter((t) => t.testNumber >= 23 && t.testNumber <= 47);
    const comprehensiveTests = RISE_49_TEST_SCHEDULE.filter((t) => t.testNumber >= 48 && t.testNumber <= 49);

    assert.equal(paper1Tests.length, 22, 'Paper I must comprise 22 tests');
    assert.equal(paper2Tests.length, 25, 'Paper II must comprise 25 tests');
    assert.equal(comprehensiveTests.length, 2, 'Final Comprehensives must comprise 2 tests');

    paper1Tests.forEach((t) => assert.equal(t.paper, 'Paper I'));
    paper2Tests.forEach((t) => assert.equal(t.paper, 'Paper II'));
    comprehensiveTests.forEach((t) => assert.equal(t.paper, 'Comprehensive'));
  });

  it('should validate RISE 2.0 fee structure and pricing tiers', () => {
    const standard = INSTITUTE_CONFIG.pricingTiers.find((t) => t.id === 'standard');
    const earlyBird = INSTITUTE_CONFIG.pricingTiers.find((t) => t.id === 'early_bird');
    const existingStudent = INSTITUTE_CONFIG.pricingTiers.find((t) => t.id === 'existing_student');

    assert.ok(standard, 'Standard pricing tier must exist');
    assert.ok(earlyBird, 'Early Bird pricing tier must exist');
    assert.ok(existingStudent, 'Existing Student pricing tier must exist');

    assert.equal(standard.amount, 8900);
    assert.equal(earlyBird.amount, 7650);
    assert.equal(existingStudent.amount, 6675);

    // Mathematical verification of 25% existing student discount
    const calculatedExisting = Math.round(8900 * (1 - 0.25));
    assert.equal(existingStudent.amount, calculatedExisting);
  });

  it('should have 4 test-day routine steps with correct timings', () => {
    assert.equal(INSTITUTE_CONFIG.testDayRoutine.length, 4);
    assert.equal(INSTITUTE_CONFIG.testDayRoutine[0].time, '6:00 PM');
    assert.equal(INSTITUTE_CONFIG.testDayRoutine[1].time, 'By 9:00 PM');
    assert.equal(INSTITUTE_CONFIG.testDayRoutine[2].time, '9:00 PM');
    assert.equal(INSTITUTE_CONFIG.testDayRoutine[3].time, 'Within 3 days');
  });
});
