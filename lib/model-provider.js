import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';

export class ModelProvider {
  constructor(config = {}) {
    this.config = config;
    this.anthropicClient = null;
    this.groqClient = null;
  }

  initAnthropic() {
    if (!this.anthropicClient) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY environment variable not set');
      }
      this.anthropicClient = new Anthropic({ apiKey });
    }
    return this.anthropicClient;
  }

  initGroq() {
    if (!this.groqClient) {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('GROQ_API_KEY environment variable not set');
      }
      this.groqClient = new Groq({ apiKey });
    }
    return this.groqClient;
  }

  async generateResponse(model, messages, systemPrompt) {
    if (model.startsWith('claude')) {
      return await this.generateAnthropic(model, messages, systemPrompt);
    } else {
      return await this.generateGroq(model, messages, systemPrompt);
    }
  }

  async generateAnthropic(model, messages, systemPrompt) {
    const client = this.initAnthropic();
    
    const response = await client.messages.create({
      model: model || 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages
    });

    return {
      content: response.content[0].text,
      model: response.model,
      provider: 'anthropic',
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    };
  }

  async generateGroq(model, messages, systemPrompt) {
    const client = this.initGroq();
    
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await client.chat.completions.create({
      model: model || 'openai/gpt-oss-120b',
      messages: groqMessages,
      max_tokens: 4096,
      temperature: 0.7
    });

    return {
      content: response.choices[0].message.content,
      model: response.model,
      provider: 'groq',
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens
      }
    };
  }

  getDefaultModel(provider) {
    if (provider === 'anthropic') {
      return 'claude-sonnet-4-6';
    } else if (provider === 'groq') {
      return 'openai/gpt-oss-120b';
    }
    return 'claude-sonnet-4-6';
  }
}
