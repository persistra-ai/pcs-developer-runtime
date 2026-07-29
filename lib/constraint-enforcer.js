export class ConstraintEnforcer {
  constructor(stateStore) {
    this.stateStore = stateStore;
  }

  async checkConstraints(userMessage) {
    const constraints = await this.stateStore.getActiveConstraints();
    const violations = [];

    for (const constraint of constraints) {
      if (this.isViolation(userMessage, constraint)) {
        violations.push(constraint);
      }
    }

    return violations;
  }

  isViolation(userMessage, constraint) {
    const messageLower = userMessage.toLowerCase();
    const ruleLower = constraint.rule.toLowerCase();

    if (ruleLower.includes('must use java') || ruleLower.includes('java-only') || ruleLower.includes('java only')) {
      if (messageLower.includes('python') && 
          (messageLower.includes('backend') || messageLower.includes('service') || messageLower.includes('api'))) {
        return true;
      }
    }

    if (ruleLower.includes('no python') || ruleLower.includes('do not') && ruleLower.includes('python')) {
      if (messageLower.includes('python') && 
          (messageLower.includes('generate') || messageLower.includes('create') || messageLower.includes('build'))) {
        return true;
      }
    }

    if (ruleLower.includes('postgresql') || ruleLower.includes('postgres')) {
      if ((messageLower.includes('mysql') || messageLower.includes('mongodb')) && 
          messageLower.includes('database')) {
        return true;
      }
    }

    return false;
  }

  async recordViolation(userMessage, violations) {
    await this.stateStore.audit('constraint_violation', {
      userMessage,
      violations: violations.map(v => ({
        id: v.id,
        title: v.title,
        rule: v.rule
      }))
    });
  }

  formatViolationMessage(violations) {
    if (violations.length === 0) {
      return null;
    }

    let message = "I cannot fulfill that request because it violates active project constraints:\n\n";
    
    for (const violation of violations) {
      message += `- **${violation.title}**: ${violation.rule}\n`;
    }

    message += "\nPlease revise your request to comply with the project constraints, or update the constraints if they need to change.";

    return message;
  }
}
