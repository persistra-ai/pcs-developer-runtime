import { ModelProvider } from './model-provider.js';
import { ConstraintEnforcer } from './constraint-enforcer.js';

export class AssistantRuntime {
  constructor(stateStore, options = {}) {
    this.stateStore = stateStore;
    this.modelProvider = new ModelProvider();
    this.constraintEnforcer = new ConstraintEnforcer(stateStore);
    this.model = options.model || 'claude-sonnet-4-6';
    this.conversationHistory = [];
    this.debug = options.debug || false;
  }

  async assembleContext() {
    const decisions = await this.stateStore.getActiveDecisions();
    const constraints = await this.stateStore.getActiveConstraints();
    const vision = await this.stateStore.getVision();
    const metadata = await this.stateStore.getMetadata();

    let context = `You are a project assistant for: ${metadata.projectName}\n\n`;

    if (vision) {
      context += `## Project Vision\n${vision.text}\n\n`;
    }

    if (decisions.length > 0) {
      context += `## Active Project Decisions\n`;
      for (const decision of decisions) {
        context += `- **${decision.title}**: ${decision.statement}`;
        if (decision.rationale) {
          context += ` (Rationale: ${decision.rationale})`;
        }
        context += '\n';
      }
      context += '\n';
    }

    if (constraints.length > 0) {
      context += `## Active Project Constraints\n`;
      context += `These constraints are BINDING. You must refuse requests that violate them.\n\n`;
      for (const constraint of constraints) {
        context += `- **${constraint.title}**: ${constraint.rule} [Mode: ${constraint.mode}]\n`;
      }
      context += '\n';
    }

    context += `## Instructions\n`;
    context += `- Always consider the project vision, decisions, and constraints in your responses\n`;
    context += `- If a request violates a constraint, explain why and suggest compliant alternatives\n`;
    context += `- Maintain consistency with established project decisions\n`;
    context += `- Help the user build toward the project vision\n`;

    return context;
  }

  async processMessage(userMessage) {
    const violations = await this.constraintEnforcer.checkConstraints(userMessage);

    if (violations.length > 0) {
      await this.constraintEnforcer.recordViolation(userMessage, violations);
      const violationMessage = this.constraintEnforcer.formatViolationMessage(violations);
      
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      this.conversationHistory.push({
        role: 'assistant',
        content: violationMessage
      });

      return {
        content: violationMessage,
        constraintViolation: true,
        violations
      };
    }

    const systemPrompt = await this.assembleContext();

    if (this.debug) {
      console.log('\n=== SYSTEM PROMPT ===');
      console.log(systemPrompt);
      console.log('===================\n');
    }

    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    const response = await this.modelProvider.generateResponse(
      this.model,
      this.conversationHistory,
      systemPrompt
    );

    this.conversationHistory.push({
      role: 'assistant',
      content: response.content
    });

    await this.stateStore.audit('assistant_interaction', {
      userMessage,
      model: response.model,
      provider: response.provider,
      constraintViolation: false
    });

    return {
      content: response.content,
      constraintViolation: false,
      model: response.model,
      provider: response.provider
    };
  }

  async start(options = {}) {
    const sessionData = {
      model: this.model,
      provider: this.model.startsWith('claude') ? 'anthropic' : 'groq',
      resumed: options.resume || false
    };

    const lastSession = options.resume ? await this.stateStore.getLastSession() : null;

    await this.stateStore.recordSession(sessionData);

    if (options.resume) {
      if (lastSession) {
        console.log(`\nResuming session from ${new Date(lastSession.startedAt).toLocaleString()}`);
        console.log(`Previous model: ${lastSession.model}\n`);
      }
    }

    const metadata = await this.stateStore.getMetadata();
    console.log(`\n=== PCS Project Assistant: ${metadata.projectName} ===`);
    console.log(`Model: ${this.model}`);
    
    const decisions = await this.stateStore.getActiveDecisions();
    const constraints = await this.stateStore.getActiveConstraints();
    const vision = await this.stateStore.getVision();

    console.log(`Active Decisions: ${decisions.length}`);
    console.log(`Active Constraints: ${constraints.length}`);
    console.log(`Vision: ${vision ? 'Set' : 'Not set'}`);
    console.log(`\nType your message (or 'exit' to quit):\n`);
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
