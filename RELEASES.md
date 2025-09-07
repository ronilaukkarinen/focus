# Release Process

This document describes how to create releases for the Focus Flow Timer fork.

## Prerequisites

1. Ensure you have commit access to the repository
2. All changes should be merged to `master` branch
3. Update version numbers in:
   - `internal/config/config.go` (Version constant)
   - `package.json` (version field)
   - `CHANGELOG.md` (add new version section)

## Automatic Release Process

The repository uses GitHub Actions with Goreleaser to automatically build releases for multiple architectures.

### Creating a Release

1. **Update version numbers** (as listed in prerequisites above)

2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "chore: bump version to v1.5.0"
   git push origin master
   ```

3. **Create and push a git tag**:
   ```bash
   git tag v1.5.0
   git push origin v1.5.0
   ```

4. **The GitHub Action will automatically**:
   - Run tests on Linux, macOS, and Windows
   - Build binaries for multiple architectures using Goreleaser
   - Create a GitHub release with all binaries attached
   - Build packages for various package managers

### Supported Architectures

The release process builds binaries for:

- **Linux**: amd64
- **Windows**: amd64, arm64  
- **macOS**: amd64, arm64 (via separate Darwin workflow)

### Package Formats

Goreleaser creates the following package formats:
- `.tar.gz` archives for Linux and macOS
- `.zip` archives for Windows
- `.deb` packages for Debian/Ubuntu
- `.rpm` packages for RHEL/CentOS/Fedora
- `.apk` packages for Alpine Linux

## Manual Release (if needed)

If you need to create a manual release:

1. **Install Goreleaser**:
   ```bash
   go install github.com/goreleaser/goreleaser@latest
   ```

2. **Build locally**:
   ```bash
   # For snapshot (testing)
   goreleaser build --snapshot --clean

   # For actual release (requires git tag)
   goreleaser release --clean
   ```

## Release Notes

Release notes are automatically generated from the commit history and CHANGELOG.md. Ensure your commit messages are descriptive and follow conventional commit format when possible.

## Troubleshooting

### Failed Release
If a release fails:
1. Check the GitHub Actions log for errors
2. Common issues:
   - Missing or invalid git tag
   - Build errors due to dependencies
   - Authentication issues with secrets

### Re-running a Release
To re-run a failed release:
1. Delete the failed release and tag from GitHub
2. Delete the local tag: `git tag -d v1.5.0`
3. Fix the issue and repeat the release process

## Post-Release

After a successful release:
1. Update installation instructions if needed
2. Announce the release in relevant channels
3. Monitor for issues and bug reports

---

For more details on Goreleaser configuration, see `.goreleaser.yml` in the repository root.