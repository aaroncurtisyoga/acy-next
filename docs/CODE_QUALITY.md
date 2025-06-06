# Code Quality & Linting Guide

This project uses multiple layers of code quality checks to prevent linting errors and maintain code consistency.

## 🛡️ Protection Layers

### 1. **Pre-commit Hooks** (Local - First Defense)

Runs automatically when you commit code:

- ✅ **ESLint** with auto-fix on staged files
- ✅ **Prettier** formatting on staged files
- ✅ **Type checking** on staged TypeScript files

### 2. **Pre-push Hooks** (Local - Second Defense)

Runs automatically when you push code:

- ✅ **Full ESLint check** on entire codebase
- ✅ **TypeScript type checking** on entire project
- ✅ **Build verification** (for main branch pushes)

### 3. **GitHub Actions CI** (Remote - Final Defense)

Runs automatically on Pull Requests and pushes to main:

- ✅ **ESLint validation**
- ✅ **TypeScript type checking**
- ✅ **Build verification**
- ✅ **Dependency security checks**

## 🚀 Quick Commands

### Check Code Quality

```bash
# Run all quality checks (lint + types)
npm run check

# Run quality checks with auto-fix
npm run check:fix

# Full validation (lint + types + build)
npm run validate

# Just linting
npm run lint
npm run lint:fix
```

### Manual Hook Testing

```bash
# Test pre-commit hook manually
npm run pre-commit

# Test what pre-push would do
npm run validate
```

## 🔧 How It Works

### Pre-commit Hook (`.husky/pre-commit`)

Uses `lint-staged` to run checks only on files you've changed:

```bash
# Only runs on staged files - fast and efficient
npx lint-staged
```

**What it does:**

- **JavaScript/TypeScript files**: Runs ESLint with auto-fix
- **All files**: Runs Prettier for consistent formatting
- **Automatically stages fixed files**

### Pre-push Hook (`.husky/pre-push`)

Provides different levels of checking based on branch:

**For main branch pushes:**

- Full ESLint check
- Complete TypeScript type checking
- Full build test

**For other branches:**

- Quick ESLint check

### GitHub Actions CI (`.github/workflows/ci.yml`)

Comprehensive checks that run in the cloud:

- Install dependencies
- Generate Prisma client
- Run ESLint
- Check TypeScript types
- Verify build works
- Check for uncommitted changes

## 🚨 What Happens When Checks Fail

### Pre-commit Failure

```bash
❌ ESLint failed. Please fix linting errors before committing.
```

**Solution:** Fix the errors or run `npm run lint:fix`

### Pre-push Failure

```bash
❌ ESLint failed. Please fix linting errors before pushing.
❌ TypeScript type checking failed. Please fix type errors before pushing.
❌ Build failed. Please fix build errors before pushing.
```

**Solution:** Run `npm run check:fix` then `npm run build` to identify and fix issues

### GitHub Actions Failure

The CI will fail and prevent merging. Check the Actions tab for details.

**Solution:**

1. Run `npm run validate` locally
2. Fix any issues
3. Commit and push fixes

## 🛠️ Configuration Files

### ESLint (`.eslintrc.json`)

Controls code style and catches potential bugs.

### Prettier (`prettier.config.js` or in `package.json`)

Handles code formatting.

### TypeScript (`tsconfig.json`)

Type checking configuration.

### Lint-staged (`package.json`)

Controls what runs on staged files:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"],
  "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write", "git add"]
}
```

## 🎯 Best Practices

### 1. **Fix Issues Early**

Don't bypass hooks - they catch issues before they reach main branch.

### 2. **Use Auto-fix Commands**

```bash
npm run lint:fix  # Auto-fix linting issues
npm run check:fix # Auto-fix + type check
```

### 3. **Test Locally Before Pushing**

```bash
npm run validate  # Full validation
```

### 4. **Keep Dependencies Updated**

```bash
npm audit fix     # Fix security vulnerabilities
npm update        # Update dependencies
```

## 🚫 Bypassing Hooks (Emergency Only)

### Skip Pre-commit Hook

```bash
git commit --no-verify -m "emergency fix"
```

### Skip Pre-push Hook

```bash
git push --no-verify
```

**⚠️ Warning:** Only use `--no-verify` in emergencies. The CI will still catch issues.

## 🔍 Troubleshooting

### Hook Not Running

```bash
# Reinstall hooks
npm run prepare
# or
npx husky install
```

### Permission Errors

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CI Failing But Local Works

1. Check if all files are committed
2. Verify Node.js version matches (v20)
3. Check environment variables in CI

## 📋 Setup Checklist

When setting up on a new machine:

- [ ] `npm install` - Install dependencies (automatically runs `prepare` script)
- [ ] Verify hooks: `ls -la .husky/`
- [ ] Test pre-commit: Stage a file and commit
- [ ] Test pre-push: Push to a feature branch
- [ ] Run full validation: `npm run validate`

## 🔄 Integration with Branch Protection

To fully protect your main branch, enable these GitHub repository settings:

1. **Settings** → **Branches** → **Add protection rule**
2. **Branch name pattern**: `main`
3. **Enable**:

   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators

4. **Select status checks**:
   - ✅ `quality-checks` (from CI workflow)

This ensures that:

- No one can push directly to main
- All changes must go through Pull Requests
- CI checks must pass before merging
- Code review is required

## 🎉 Benefits

✅ **Consistent Code Style** - Prettier + ESLint keep formatting uniform
✅ **Catch Bugs Early** - TypeScript + ESLint catch issues before runtime
✅ **Prevent Broken Builds** - Build verification before deployment
✅ **Team Collaboration** - Everyone follows the same standards
✅ **Automated Quality** - No manual intervention needed
✅ **Fast Feedback** - Issues caught immediately, not in CI
