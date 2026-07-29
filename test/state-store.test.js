import { test } from 'node:test';
import assert from 'node:assert';
import { StateStore } from '../lib/state-store.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testProjectPath = path.join(__dirname, 'test-project');

test('StateStore - complete workflow', async (t) => {
  await t.test('cleanup before test', async () => {
    try {
      await fs.rm(testProjectPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore if doesn't exist
    }
  });

  await t.test('initialize project', async () => {
    const store = new StateStore(testProjectPath);
    await store.init('test-backend');

    const metadata = await store.getMetadata();
    assert.strictEqual(metadata.projectName, 'test-backend');
    assert.ok(metadata.createdAt);
  });

  await t.test('add and retrieve decisions', async () => {
    const store = new StateStore(testProjectPath);

    const decision1 = await store.addDecision({
      title: 'Use PostgreSQL',
      statement: 'Use PostgreSQL for persistence',
      rationale: 'Proven reliability and ACID compliance'
    });

    assert.ok(decision1.id);
    assert.strictEqual(decision1.title, 'Use PostgreSQL');
    assert.strictEqual(decision1.status, 'active');

    const decision2 = await store.addDecision({
      title: 'Use gRPC',
      statement: 'Use gRPC between internal services'
    });

    const decisions = await store.getActiveDecisions();
    assert.strictEqual(decisions.length, 2);
    assert.strictEqual(decisions[0].title, 'Use PostgreSQL');
    assert.strictEqual(decisions[1].title, 'Use gRPC');
  });

  await t.test('add and retrieve constraints', async () => {
    const store = new StateStore(testProjectPath);

    const constraint = await store.addConstraint({
      title: 'Java-only backend',
      rule: 'Backend services must use Java',
      mode: 'block'
    });

    assert.ok(constraint.id);
    assert.strictEqual(constraint.title, 'Java-only backend');
    assert.strictEqual(constraint.mode, 'block');
    assert.strictEqual(constraint.status, 'active');

    const constraints = await store.getActiveConstraints();
    assert.strictEqual(constraints.length, 1);
    assert.strictEqual(constraints[0].rule, 'Backend services must use Java');
  });

  await t.test('set and retrieve vision', async () => {
    const store = new StateStore(testProjectPath);

    const vision = await store.setVision('Build a modular microservices backend');

    assert.strictEqual(vision.text, 'Build a modular microservices backend');
    assert.ok(vision.setAt);

    const retrievedVision = await store.getVision();
    assert.strictEqual(retrievedVision.text, 'Build a modular microservices backend');
  });

  await t.test('audit log records events', async () => {
    const store = new StateStore(testProjectPath);

    const auditLog = await store.getAuditLog();
    
    assert.ok(auditLog.length > 0);
    
    const eventTypes = auditLog.map(e => e.eventType);
    assert.ok(eventTypes.includes('project_created'));
    assert.ok(eventTypes.includes('decision_added'));
    assert.ok(eventTypes.includes('constraint_added'));
    assert.ok(eventTypes.includes('vision_set'));
  });

  await t.test('session recording', async () => {
    const store = new StateStore(testProjectPath);

    const session = await store.recordSession({
      model: 'claude-3-5-sonnet-20241022',
      provider: 'anthropic'
    });

    assert.ok(session.id);
    assert.strictEqual(session.model, 'claude-3-5-sonnet-20241022');
    assert.strictEqual(session.provider, 'anthropic');

    const lastSession = await store.getLastSession();
    assert.strictEqual(lastSession.id, session.id);
  });

  await t.test('state persists across StateStore instances', async () => {
    const store1 = new StateStore(testProjectPath);
    const decisions1 = await store1.getActiveDecisions();
    const constraints1 = await store1.getActiveConstraints();
    const vision1 = await store1.getVision();

    const store2 = new StateStore(testProjectPath);
    const decisions2 = await store2.getActiveDecisions();
    const constraints2 = await store2.getActiveConstraints();
    const vision2 = await store2.getVision();

    assert.strictEqual(decisions2.length, decisions1.length);
    assert.strictEqual(constraints2.length, constraints1.length);
    assert.strictEqual(vision2.text, vision1.text);
  });

  await t.test('cleanup after test', async () => {
    await fs.rm(testProjectPath, { recursive: true, force: true });
  });
});
