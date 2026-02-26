# Contributing to HEALX

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Use async/await over callbacks

### React
- Functional components with hooks
- PropTypes or TypeScript
- One component per file
- CSS modules or Tailwind

### Python
- PEP 8 style
- 4-space indentation
- Type hints recommended
- Docstrings for functions

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and create PR
4. Code review and merge

## Commit Messages

Format: `type(scope): message`

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Testing

Example: `feat(emergency): add severity prediction`

## Pull Request Process

1. Update documentation
2. Add tests if applicable
3. Update CHANGELOG.md
4. Request review
5. Address feedback
6. Merge after approval

## Testing

```bash
# Backend
npm test

# Frontend
npm test -- --watch

# AI Service
pytest
```

## Reporting Issues

Include:
- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment details

## Security Reporting

Report security issues privately to security@healx.com
