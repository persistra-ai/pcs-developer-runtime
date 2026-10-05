#!/usr/bin/env node

import { StateStore } from '../lib/state-store.js';
import { AssistantRuntime } from '../lib/assistant-runtime.js';

const projectPath = process.cwd();

async function testWorkflow() {
  console.log('=== PCS Developer Runtime: Flagship Workflow Test ===\n');

  const stateStore = new StateStore(projectPath);
  
  // Test 1: Compliant request (should work)
  console.log('TEST 1: Compliant Design Request');
  console.log('─'.repeat(60));
  
  const runtime1 = new AssistantRuntime(stateStore, {
    model: 'claude-sonnet-4-6',
    debug: false
  });

  await runtime1.start({ resume: false });
  
  console.log('\nUser: Design the initial service structure for the backend\n');
  
  const response1 = await runtime1.processMessage('Design the initial service structure for the backend');
  
  console.log('Assistant:', response1.content.substring(0, 500) + '...\n');
  console.log(`Model: ${response1.model || 'claude-sonnet-4-6'}`);
  console.log(`Constraint Violation: ${response1.constraintViolation}\n`);

  // Test 2: Constraint violation (should block)
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Constraint Violation');
  console.log('─'.repeat(60));
  
  console.log('\nUser: Generate a FastAPI Python backend for the auth service\n');
  
  const response2 = await runtime1.processMessage('Generate a FastAPI Python backend for the auth service');
  
  console.log('Assistant:', response2.content);
  console.log(`Constraint Violation: ${response2.constraintViolation}`);
  
  if (response2.violations) {
    console.log('\nViolated Constraints:');
    for (const v of response2.violations) {
      console.log(`  - ${v.title}: ${v.rule}`);
    }
  }

  // Test 3: Model swap with continuity
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Model Swap (Claude → GPT-OSS)');
  console.log('─'.repeat(60));
  
  const runtime2 = new AssistantRuntime(stateStore, {
    model: 'openai/gpt-oss-120b',
    debug: false
  });

  await runtime2.start({ resume: true });
  
  console.log('\nUser: What are the main architectural decisions so far?\n');
  
  const response3 = await runtime2.processMessage('What are the main architectural decisions so far?');
  
  console.log('Assistant:', response3.content.substring(0, 500) + '...\n');
  console.log(`Model: ${response3.model || 'openai/gpt-oss-120b'}`);
  console.log(`Provider: ${response3.provider || 'groq'}`);

  // Show audit trail
  console.log('\n' + '='.repeat(60));
  console.log('AUDIT TRAIL');
  console.log('─'.repeat(60) + '\n');
  
  const auditLog = await stateStore.getAuditLog(10);
  
  for (const entry of auditLog.slice(-5)) {
    const timestamp = new Date(entry.timestamp).toLocaleString();
    console.log(`[${timestamp}] ${entry.eventType}`);
    if (entry.eventType === 'constraint_violation') {
      console.log(`  Request: "${entry.data.userMessage}"`);
      console.log(`  Action: Blocked by runtime`);
    } else if (entry.eventType === 'session_started') {
      console.log(`  Model: ${entry.data.model}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('ASSESSMENT');
  console.log('─'.repeat(60));
  console.log('\n1. Constraint enforcement: ' + (response2.constraintViolation ? '✓ BLOCKED' : '✗ FAILED'));
  console.log('2. Vision impact: ' + (response1.content.toLowerCase().includes('microservices') || response1.content.toLowerCase().includes('modular') ? '✓ VISIBLE' : '? UNCLEAR'));
  console.log('3. Model swap: ' + (response3.model && response3.model.includes('gpt-oss') ? '✓ SUCCESSFUL' : '✗ FAILED'));
  
  console.log('\n=== Test Complete ===\n');
}

testWorkflow().catch(error => {
  console.error('Error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
