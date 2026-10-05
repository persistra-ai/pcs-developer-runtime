import { StateStore } from './state-store.js';
import { AssistantRuntime } from './assistant-runtime.js';
import readline from 'readline';
import path from 'path';
import fs from 'fs/promises';

function promptAll(prompts) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const answers = [];

    rl.on('line', (line) => {
      answers.push(line);
      if (answers.length === prompts.length) {
        rl.close();
      } else {
        rl.setPrompt(prompts[answers.length]);
        rl.prompt();
      }
    });

    rl.on('close', () => {
      while (answers.length < prompts.length) {
        answers.push('');
      }
      resolve(answers);
    });

    rl.setPrompt(prompts[0]);
    rl.prompt();
  });
}

function requireValue(value, field) {
  if (!value || !value.trim()) {
    throw new Error(`${field} is required`);
  }
}

export class CLI {
  constructor() {
    this.currentProject = null;
    this.stateStore = null;
  }

  async init(projectName, options = {}) {
    const projectPath = path.join(process.cwd(), projectName);
    
    try {
      await fs.access(projectPath);
      console.error(`Error: Project directory '${projectName}' already exists`);
      process.exit(1);
    } catch (error) {
      // Directory doesn't exist, which is what we want
    }

    await fs.mkdir(projectPath, { recursive: true });
    
    const stateStore = new StateStore(projectPath);
    await stateStore.init(projectName);

    console.log(`✓ Created PCS project: ${projectName}`);
    console.log(`✓ Initialized substrate state store`);
    console.log(`\nProject created at: ${projectPath}`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  pcs decision add`);
    console.log(`  pcs constraint add`);
    console.log(`  pcs vision set`);
    console.log(`  pcs run assistant`);
  }

  async loadProject() {
    const projectPath = process.cwd();
    const statePath = path.join(projectPath, '.pcs');

    try {
      await fs.access(statePath);
      this.stateStore = new StateStore(projectPath);
      return true;
    } catch (error) {
      console.error('Error: Not in a PCS project directory');
      console.error('Run "pcs init <project-name>" to create a new project');
      process.exit(1);
    }
  }

  async decisionAdd(options = {}) {
    await this.loadProject();

    let title, statement, rationale;

    if (options.title && options.statement) {
      title = options.title;
      statement = options.statement;
      rationale = options.rationale || null;
    } else {
      [title, statement, rationale] = await promptAll([
        'Decision title: ',
        'Decision statement: ',
        'Rationale (optional): '
      ]);
    }

    requireValue(title, 'Decision title');
    requireValue(statement, 'Decision statement');

    const decision = await this.stateStore.addDecision({
      title: title.trim(),
      statement: statement.trim(),
      rationale: rationale ? rationale.trim() : null
    });

    console.log(`\n✓ Added decision: ${decision.title}`);
    console.log(`  ID: ${decision.id}`);
    console.log(`  Status: ${decision.status}`);
    console.log(`\nRun 'pcs decision list' to see all decisions`);
  }

  async decisionList() {
    await this.loadProject();

    const decisions = await this.stateStore.getActiveDecisions();

    if (decisions.length === 0) {
      console.log('No active decisions');
      return;
    }

    console.log(`\n=== Active Decisions (${decisions.length}) ===\n`);

    for (const decision of decisions) {
      console.log(`[${decision.id}] ${decision.title}`);
      console.log(`  ${decision.statement}`);
      if (decision.rationale) {
        console.log(`  Rationale: ${decision.rationale}`);
      }
      console.log(`  Created: ${new Date(decision.createdAt).toLocaleString()}`);
      console.log('');
    }
  }

  async constraintAdd(options = {}) {
    await this.loadProject();

    let title, rule, mode;

    if (options.title && options.rule) {
      title = options.title;
      rule = options.rule;
      mode = options.mode || 'block';
    } else {
      let modeInput;
      [title, rule, modeInput] = await promptAll([
        'Constraint title: ',
        'Constraint rule: ',
        'Enforcement mode (block/warn) [block]: '
      ]);
      mode = modeInput.trim() || 'block';
    }

    requireValue(title, 'Constraint title');
    requireValue(rule, 'Constraint rule');

    const constraint = await this.stateStore.addConstraint({
      title: title.trim(),
      rule: rule.trim(),
      mode
    });

    console.log(`\n✓ Added constraint: ${constraint.title}`);
    console.log(`  ID: ${constraint.id}`);
    console.log(`  Mode: ${constraint.mode}`);
    console.log(`  Status: ${constraint.status}`);
    console.log(`\nRun 'pcs constraint list' to see all constraints`);
  }

  async constraintList() {
    await this.loadProject();

    const constraints = await this.stateStore.getActiveConstraints();

    if (constraints.length === 0) {
      console.log('No active constraints');
      return;
    }

    console.log(`\n=== Active Constraints (${constraints.length}) ===\n`);

    for (const constraint of constraints) {
      console.log(`[${constraint.id}] ${constraint.title}`);
      console.log(`  Rule: ${constraint.rule}`);
      console.log(`  Mode: ${constraint.mode}`);
      console.log(`  Created: ${new Date(constraint.createdAt).toLocaleString()}`);
      console.log('');
    }
  }

  async visionSet(visionText = null, options = {}) {
    await this.loadProject();

    if (!visionText && !options.text) {
      [visionText] = await promptAll(['Project vision: ']);
    } else if (options.text) {
      visionText = options.text;
    }

    requireValue(visionText, 'Project vision');

    const vision = await this.stateStore.setVision(visionText.trim());

    console.log(`\n✓ Set project vision`);
    console.log(`\n${vision.text}`);
    console.log(`\nRun 'pcs vision show' to view current vision`);
  }

  async visionShow() {
    await this.loadProject();

    const vision = await this.stateStore.getVision();

    if (!vision) {
      console.log('No vision set');
      console.log('Run "pcs vision set" to set project vision');
      return;
    }

    console.log(`\n=== Project Vision ===\n`);
    console.log(vision.text);
    console.log(`\nSet at: ${new Date(vision.setAt).toLocaleString()}`);
  }

  async status() {
    await this.loadProject();

    const metadata = await this.stateStore.getMetadata();
    const decisions = await this.stateStore.getActiveDecisions();
    const constraints = await this.stateStore.getActiveConstraints();
    const vision = await this.stateStore.getVision();
    const lastSession = await this.stateStore.getLastSession();
    const auditLog = await this.stateStore.getAuditLog();

    console.log(`\n=== PCS Project Status ===\n`);
    console.log(`Project: ${metadata.projectName}`);
    console.log(`Created: ${new Date(metadata.createdAt).toLocaleString()}`);
    console.log(`\nActive Decisions: ${decisions.length}`);
    console.log(`Active Constraints: ${constraints.length}`);
    console.log(`Vision: ${vision ? 'Set' : 'Not set'}`);
    
    if (lastSession) {
      console.log(`\nLast Session:`);
      console.log(`  Time: ${new Date(lastSession.startedAt).toLocaleString()}`);
      console.log(`  Model: ${lastSession.model}`);
      console.log(`  Provider: ${lastSession.provider}`);
    }

    console.log(`\nAudit Events: ${auditLog.length}`);
  }

  async auditShow(options = {}) {
    await this.loadProject();

    const limit = options.limit || 20;
    const auditLog = await this.stateStore.getAuditLog(limit);

    if (auditLog.length === 0) {
      console.log('No audit events');
      return;
    }

    console.log(`\n=== Decision Trace (last ${auditLog.length} events) ===\n`);

    for (const entry of auditLog) {
      const timestamp = new Date(entry.timestamp).toLocaleString();
      
      switch (entry.eventType) {
        case 'project_created':
          console.log(`[${timestamp}] Project Created`);
          console.log(`  ${entry.data.projectName}`);
          console.log(`  Initialized substrate state store`);
          break;

        case 'decision_added':
          console.log(`[${timestamp}] Decision Added`);
          console.log(`  ${entry.data.title}`);
          console.log(`  This decision is now active in project state`);
          break;

        case 'constraint_added':
          console.log(`[${timestamp}] Constraint Added`);
          console.log(`  ${entry.data.title}`);
          console.log(`  This constraint will be enforced at runtime`);
          break;

        case 'vision_set':
          console.log(`[${timestamp}] Vision Set`);
          console.log(`  "${entry.data.vision}"`);
          console.log(`  Vision will guide all assistant interactions`);
          break;

        case 'session_started':
          console.log(`[${timestamp}] Session Started`);
          console.log(`  Model: ${entry.data.model}`);
          console.log(`  Provider: ${entry.data.provider}`);
          if (entry.data.resumed) {
            console.log(`  Resumed from previous session`);
          }
          break;

        case 'constraint_violation':
          console.log(`[${timestamp}] ⚠️  Constraint Violation Blocked`);
          console.log(`  Request: "${entry.data.userMessage}"`);
          if (entry.data.violations && entry.data.violations.length > 0) {
            console.log(`  Violated constraints:`);
            for (const v of entry.data.violations) {
              console.log(`    - ${v.title}: ${v.rule}`);
            }
          }
          console.log(`  Action: Request blocked by runtime enforcement`);
          break;

        case 'assistant_interaction':
          console.log(`[${timestamp}] Assistant Interaction`);
          console.log(`  Model: ${entry.data.model} (${entry.data.provider})`);
          if (entry.data.constraintViolation) {
            console.log(`  Result: Constraint violation`);
          } else {
            console.log(`  Result: Response generated`);
          }
          break;

        default:
          console.log(`[${timestamp}] ${entry.eventType}`);
          if (entry.data && Object.keys(entry.data).length > 0) {
            for (const [key, value] of Object.entries(entry.data)) {
              if (typeof value === 'object') {
                console.log(`  ${key}: ${JSON.stringify(value)}`);
              } else {
                console.log(`  ${key}: ${value}`);
              }
            }
          }
      }
      console.log('');
    }

    console.log('This trace shows all substrate state changes and runtime enforcement actions.');
  }

  async runAssistant(options = {}) {
    await this.loadProject();

    const model = options.model || 'claude-sonnet-4-6';
    const runtime = new AssistantRuntime(this.stateStore, {
      model,
      debug: options.debug || false
    });

    await runtime.start({ resume: options.resume || false });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n> '
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();

      if (input === 'exit' || input === 'quit') {
        console.log('\nExiting assistant session...');
        rl.close();
        return;
      }

      if (!input) {
        rl.prompt();
        return;
      }

      try {
        const response = await runtime.processMessage(input);
        
        console.log(`\n${response.content}\n`);

        if (response.constraintViolation) {
          console.log(`⚠️  Constraint violation recorded in audit log`);
        }

        rl.prompt();
      } catch (error) {
        console.error(`\nError: ${error.message}\n`);
        rl.prompt();
      }
    });

    rl.on('close', () => {
      console.log('\nSession ended');
      process.exit(0);
    });
  }
}
