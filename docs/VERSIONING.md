# Versioning Guide

This project uses semantic versioning (semver) with automated GitHub Actions for version management and releases.

## Version Format

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (X.Y.0): New features, backwards compatible
- **PATCH** (X.Y.Z): Bug fixes, backwards compatible

## Automated Versioning (Recommended)

### Method 1: Manual Trigger (GitHub Actions)

1. Go to the [Actions tab](../../actions) in the GitHub repository
2. Select "Version and Release" workflow
3. Click "Run workflow"
4. Choose version bump type (patch, minor, major)
5. Click "Run workflow"

This will:
- Bump the version in `package.json`
- Create a git tag
- Generate a changelog
- Create a GitHub release

### Method 2: Commit Message Trigger

Include special keywords in your commit messages to trigger automatic versioning:

```bash
# Patch version (1.0.0 → 1.0.1)
git commit -m "fix: resolve header styling issue [version]"

# Minor version (1.0.0 → 1.1.0)
git commit -m "feat: add new user dashboard [version] [minor]"

# Major version (1.0.0 → 2.0.0)
git commit -m "feat!: restructure API endpoints [version] [major]"
```

**Keywords:**
- `[version]` - Triggers versioning (defaults to patch)
- `[minor]` - Forces minor version bump
- `[major]` - Forces major version bump

## Manual Versioning (Local)

### Using npm scripts:

```bash
# Patch version (1.0.0 → 1.0.1)
npm run version:patch

# Minor version (1.0.0 → 1.1.0)
npm run version:minor

# Major version (1.0.0 → 2.0.0)
npm run version:major
```

### Using the script directly:

```bash
# Patch version
./scripts/version.sh patch

# Minor version
./scripts/version.sh minor

# Major version
./scripts/version.sh major
```

After running the script locally, you'll need to push the changes:

```bash
# Push changes and tags
git push origin main --tags
```

## What Happens During Versioning

1. **Version Update**: Updates version in `package.json` and `package-lock.json`
2. **Git Commit**: Creates a commit with the version bump
3. **Git Tag**: Creates a new git tag with the version (e.g., `v1.2.3`)
4. **Changelog**: Generates changelog from git commits since last version
5. **GitHub Release**: Creates a new GitHub release with the changelog

## Version History

You can view all versions and releases:
- [Releases page](../../releases) - GitHub releases with changelogs
- [Tags page](../../tags) - All git tags

## Best Practices

1. **Commit Often**: Make small, focused commits with clear messages
2. **Use Conventional Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
3. **Test Before Release**: Ensure all tests pass before creating a new version
4. **Document Changes**: Write meaningful commit messages for better changelogs
5. **Review Changes**: Use the GitHub Actions method for important releases

## Troubleshooting

### Script Permission Error
```bash
chmod +x scripts/version.sh
```

### Git Working Directory Not Clean
Commit or stash your changes before running versioning:
```bash
git add .
git commit -m "your changes"
# or
git stash
```

### GitHub Actions Not Running
- Ensure you have write permissions to the repository
- Check that the workflow file is in `.github/workflows/version.yml`
- Verify the workflow is enabled in the Actions tab

## Examples

### Bug Fix Release
```bash
# Fix a bug and create patch release
git add .
git commit -m "fix: resolve navigation menu bug [version]"
git push origin main
# This triggers v1.0.1 (if current version is v1.0.0)
```

### Feature Release
```bash
# Add new feature and create minor release
git add .
git commit -m "feat: add user profile page [version] [minor]"
git push origin main
# This triggers v1.1.0 (if current version is v1.0.0)
```

### Breaking Change Release
```bash
# Make breaking changes and create major release
git add .
git commit -m "feat!: restructure authentication system [version] [major]"
git push origin main
# This triggers v2.0.0 (if current version is v1.0.0)
``` 