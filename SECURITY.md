# Security Policy

## Reporting Security Issues

**We take security seriously.** If you discover a security vulnerability in the PCS Developer Runtime, please report it responsibly.

### How to Report

**Email:** security@persistra.ai

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response time:** We aim to acknowledge reports within 48 hours and provide a detailed response within 7 days.

### Scope

This security policy applies to:
- The PCS Developer Runtime implementation
- Tutorial code and examples
- Build scripts and tooling

### Out of Scope

- Third-party dependencies (report to their maintainers)
- Theoretical attacks without proof of concept
- Issues in private/NDA repositories (contact research@persistra.ai)

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Best Practices

### For Developers

**When using the tutorial:**
1. Use dedicated API keys (not production keys)
2. Review tutorial code before execution
3. Never commit `.env` files
4. Use `.env.example` as template
5. Rotate keys if accidentally exposed

**Environment security:**
- Keep API keys in environment variables only
- Use `.gitignore` to exclude `.env` files
- Rotate keys after development/testing

---

## Vulnerability Disclosure Timeline

**If a vulnerability is confirmed:**

1. **Day 0:** Acknowledgment sent to reporter
2. **Day 1-7:** Validation and impact assessment
3. **Day 7-30:** Fix development and testing
4. **Day 30:** Coordinated disclosure (if applicable)
5. **Day 30+:** Public disclosure and patch release

**We follow responsible disclosure practices** and will credit reporters (unless anonymity is requested).

---

## Security Contacts

**Security issues:** security@persistra.ai  
**General questions:** research@persistra.ai  
**Commercial licensing:** licensing@persistra.ai

---

## Additional Resources

- [TUTORIAL.md](TUTORIAL.md) - Developer tutorial
- [README.md](README.md) - Repository overview
- [persistra-cts](https://github.com/persistra-ai/persistra-cts) - Full validation suite

---

**Last Updated:** July 2026  
**Version:** 1.0.0
