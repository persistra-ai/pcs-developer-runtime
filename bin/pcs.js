#!/usr/bin/env node

import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLI } from '../lib/cli.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const envPath of [path.join(process.cwd(), '.env'), path.join(repoRoot, '.env')]) {
  if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

const cli = new CLI();
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('PCS Developer Runtime v0.1.0');
  console.log('');
  console.log('Usage:');
  console.log('  pcs init <project-name>     Create a new PCS project');
  console.log('  pcs decision add            Add a project decision (interactive)');
  console.log('  pcs decision list           List active decisions');
  console.log('  pcs constraint add          Add a project constraint');
  console.log('  pcs constraint list         List active constraints');
  console.log('  pcs vision set              Set project vision');
  console.log('  pcs vision show             Show current vision');
  console.log('  pcs run assistant           Start assistant session');
  console.log('  pcs audit show              Show audit log');
  console.log('  pcs status                  Show project status');
  console.log('');
  console.log('Options for "pcs decision add" (non-interactive):');
  console.log('  --title <text>              Decision title');
  console.log('  --statement <text>          Decision statement');
  console.log('  --rationale <text>          Decision rationale (optional)');
  console.log('');
  console.log('Options for "pcs run assistant":');
  console.log('  --model <name>              Specify model (default: claude-sonnet-4-6)');
  console.log('  --resume                    Resume from previous session');
  console.log('  --debug                     Show debug information');
  console.log('');
  console.log('Examples:');
  console.log('  pcs init my-backend');
  console.log('  pcs decision add --title "Use PostgreSQL" --statement "Use PostgreSQL for persistence"');
  console.log('  pcs run assistant --model openai/gpt-oss-120b');
  console.log('  pcs run assistant --resume');
  process.exit(0);
}

const command = args[0];
const subcommand = args[1];

async function main() {
  try {
    if (command === 'init') {
      const projectName = subcommand;
      if (!projectName) {
        console.error('Error: Project name required');
        console.error('Usage: pcs init <project-name>');
        process.exit(1);
      }
      await cli.init(projectName);
    } else if (command === 'decision') {
      if (subcommand === 'add') {
        const options = {};
        for (let i = 2; i < args.length; i++) {
          if (args[i] === '--title' && args[i + 1]) {
            options.title = args[i + 1];
            i++;
          } else if (args[i] === '--statement' && args[i + 1]) {
            options.statement = args[i + 1];
            i++;
          } else if (args[i] === '--rationale' && args[i + 1]) {
            options.rationale = args[i + 1];
            i++;
          }
        }
        await cli.decisionAdd(options);
      } else if (subcommand === 'list') {
        await cli.decisionList();
      } else {
        console.error('Unknown decision command:', subcommand);
        console.error('Available: add, list');
        process.exit(1);
      }
    } else if (command === 'constraint') {
      if (subcommand === 'add') {
        await cli.constraintAdd();
      } else if (subcommand === 'list') {
        await cli.constraintList();
      } else {
        console.error('Unknown constraint command:', subcommand);
        console.error('Available: add, list');
        process.exit(1);
      }
    } else if (command === 'vision') {
      if (subcommand === 'set') {
        await cli.visionSet();
      } else if (subcommand === 'show') {
        await cli.visionShow();
      } else {
        console.error('Unknown vision command:', subcommand);
        console.error('Available: set, show');
        process.exit(1);
      }
    } else if (command === 'run') {
      if (subcommand === 'assistant') {
        const options = {};
        for (let i = 2; i < args.length; i++) {
          if (args[i] === '--model' && args[i + 1]) {
            options.model = args[i + 1];
            i++;
          } else if (args[i] === '--resume') {
            options.resume = true;
          } else if (args[i] === '--debug') {
            options.debug = true;
          }
        }
        await cli.runAssistant(options);
      } else {
        console.error('Unknown run command:', subcommand);
        console.error('Available: assistant');
        process.exit(1);
      }
    } else if (command === 'audit') {
      if (subcommand === 'show') {
        await cli.auditShow();
      } else {
        console.error('Unknown audit command:', subcommand);
        console.error('Available: show');
        process.exit(1);
      }
    } else if (command === 'status') {
      await cli.status();
    } else {
      console.error('Unknown command:', command);
      console.error('Run "pcs" without arguments to see usage');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
