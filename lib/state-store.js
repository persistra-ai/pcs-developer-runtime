import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class StateStore {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.statePath = path.join(projectPath, '.pcs');
    this.decisionsPath = path.join(this.statePath, 'decisions.json');
    this.constraintsPath = path.join(this.statePath, 'constraints.json');
    this.visionPath = path.join(this.statePath, 'vision.json');
    this.auditPath = path.join(this.statePath, 'audit.json');
    this.metadataPath = path.join(this.statePath, 'metadata.json');
    this.sessionsPath = path.join(this.statePath, 'sessions.json');
  }

  async init(projectName) {
    await fs.mkdir(this.statePath, { recursive: true });
    
    const metadata = {
      projectName,
      createdAt: new Date().toISOString(),
      version: '0.1.0'
    };

    await this.writeJSON(this.metadataPath, metadata);
    await this.writeJSON(this.decisionsPath, []);
    await this.writeJSON(this.constraintsPath, []);
    await this.writeJSON(this.visionPath, { active: null, history: [] });
    await this.writeJSON(this.auditPath, []);
    await this.writeJSON(this.sessionsPath, []);

    await this.audit('project_created', { projectName });
  }

  async readJSON(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async writeJSON(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getMetadata() {
    return await this.readJSON(this.metadataPath);
  }

  async addDecision(decision) {
    const decisions = await this.readJSON(this.decisionsPath) || [];
    const newDecision = {
      id: this.generateId(),
      title: decision.title,
      statement: decision.statement,
      rationale: decision.rationale || null,
      tags: decision.tags || [],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    decisions.push(newDecision);
    await this.writeJSON(this.decisionsPath, decisions);
    await this.audit('decision_added', { decisionId: newDecision.id, title: newDecision.title });
    return newDecision;
  }

  async getDecisions() {
    return await this.readJSON(this.decisionsPath) || [];
  }

  async getActiveDecisions() {
    const decisions = await this.getDecisions();
    return decisions.filter(d => d.status === 'active');
  }

  async addConstraint(constraint) {
    const constraints = await this.readJSON(this.constraintsPath) || [];
    const newConstraint = {
      id: this.generateId(),
      title: constraint.title,
      rule: constraint.rule,
      scope: constraint.scope || 'global',
      mode: constraint.mode || 'block',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    constraints.push(newConstraint);
    await this.writeJSON(this.constraintsPath, constraints);
    await this.audit('constraint_added', { constraintId: newConstraint.id, title: newConstraint.title });
    return newConstraint;
  }

  async getConstraints() {
    return await this.readJSON(this.constraintsPath) || [];
  }

  async getActiveConstraints() {
    const constraints = await this.getConstraints();
    return constraints.filter(c => c.status === 'active');
  }

  async setVision(visionText) {
    const visionData = await this.readJSON(this.visionPath) || { active: null, history: [] };
    
    if (visionData.active) {
      visionData.history.push({
        vision: visionData.active,
        replacedAt: new Date().toISOString()
      });
    }

    visionData.active = {
      text: visionText,
      setAt: new Date().toISOString()
    };

    await this.writeJSON(this.visionPath, visionData);
    await this.audit('vision_set', { vision: visionText });
    return visionData.active;
  }

  async getVision() {
    const visionData = await this.readJSON(this.visionPath);
    return visionData?.active || null;
  }

  async audit(eventType, data = {}) {
    const auditLog = await this.readJSON(this.auditPath) || [];
    const auditEntry = {
      id: this.generateId(),
      eventType,
      timestamp: new Date().toISOString(),
      data
    };
    auditLog.push(auditEntry);
    await this.writeJSON(this.auditPath, auditLog);
    return auditEntry;
  }

  async getAuditLog(limit = 50) {
    const auditLog = await this.readJSON(this.auditPath) || [];
    return auditLog.slice(-limit);
  }

  async recordSession(sessionData) {
    const sessions = await this.readJSON(this.sessionsPath) || [];
    const session = {
      id: this.generateId(),
      startedAt: new Date().toISOString(),
      model: sessionData.model,
      provider: sessionData.provider,
      ...sessionData
    };
    sessions.push(session);
    await this.writeJSON(this.sessionsPath, sessions);
    await this.audit('session_started', { sessionId: session.id, model: session.model });
    return session;
  }

  async getLastSession() {
    const sessions = await this.readJSON(this.sessionsPath) || [];
    return sessions[sessions.length - 1] || null;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
