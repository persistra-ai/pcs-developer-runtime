#!/usr/bin/env node

import { CLI } from '../lib/cli.js';

const cli = new CLI();

async function main() {
  console.log('Adding test data to project...\n');

  // Add decision 1
  await cli.decisionAdd({
    title: 'Use PostgreSQL for persistence',
    statement: 'Use PostgreSQL for all data persistence needs',
    rationale: 'Proven reliability, ACID compliance, and strong ecosystem'
  });

  // Add decision 2
  await cli.decisionAdd({
    title: 'Use gRPC between internal services',
    statement: 'Internal service communication should use gRPC',
    rationale: 'Type safety, performance, and built-in streaming support'
  });

  // Add constraint
  await cli.constraintAdd({
    title: 'Java-only backend',
    rule: 'Backend services must use Java; do not generate Python backend code',
    mode: 'block'
  });

  // Set vision
  await cli.visionSet(null, {
    text: 'Build a modular microservices backend with strong internal consistency and low operational complexity'
  });

  console.log('\n✓ Test data added successfully');
  console.log('\nRun "pcs status" to verify');
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
