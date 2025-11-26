# Making Your Repository Private

This guide explains how to secure your Teos&Pi Smart City repository as a private, badge-gated project.

## Step 1: Make Repository Private on GitHub

1. Go to your repository: https://github.com/Elmahrosa/Teos-Pi-Smart-City
2. Click **Settings** (top right of repository page)
3. Scroll down to the **Danger Zone** section
4. Click **Change repository visibility**
5. Select **Make private**
6. Type the repository name to confirm
7. Click **I understand, change repository visibility**

## Step 2: Restrict Access with Badge System

### Add Collaborators
1. Go to **Settings** → **Collaborators and teams**
2. Click **Add people**
3. Only invite badge-approved contributors who have signed:
   - NDA (docs/NDA_TEMPLATE.md)
   - Contributor Agreement (docs/CONTRIBUTOR_AGREEMENT.md)

### Set Permission Levels
- **Read**: Citizen badge holders (view only)
- **Write**: Contributor badge holders (approved code submissions)
- **Admin**: Founder and core auditors only

## Step 3: Configure Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require conversation resolution before merging
   - Require signed commits
   - Include administrators

## Step 4: Disable Forking

The repository is already configured with forking disabled via the proprietary license. Verify:
1. Go to **Settings** → **General**
2. Under **Features**, ensure **Allow forking** is unchecked
3. If visible, uncheck it and save

## Step 5: Set Up Secrets for Automation

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   - `GITHUB_TOKEN` (auto-generated, verify it exists)
   - `PI_API_KEY` (for Pi Network integration)
   - Any database credentials for treasury

## Step 6: Configure Deploy Keys (Vercel)

1. Go to Vercel dashboard
2. Import project from GitHub (will ask for private repo access)
3. Grant Vercel access to your private repository
4. Configure environment variables in Vercel:
   - Copy from `.env.example`
   - Add production Pi API keys
   - Configure treasury endpoints

## Step 7: Public Dashboard vs Private Code

Your setup allows for:
- **Private Code Repository**: Only badge-approved contributors can access source
- **Public Documentation Site**: MkDocs site at teospismartcitye8281.pinet.com shows dashboards only
- **Public Transparency**: Treasury and governance dashboards visible, code hidden

## Step 8: Monitor Access

Regular audits:
1. Review collaborator list monthly
2. Check Actions logs for unauthorized access attempts
3. Verify all commits are signed and from approved contributors
4. Monitor Stars/Forks (should remain at 0 due to private status)

## Step 9: Legal Documentation Compliance

Ensure all contributors have:
- [x] Signed NDA (stored securely offline)
- [x] Signed Contributor Agreement
- [x] Paid 5 Pi petition fee
- [x] Received appropriate badge (citizen/contributor/auditor)
- [x] Added to internal registry

## Step 10: Backup and Recovery

1. Enable automatic backups in GitHub settings
2. Keep local copies of critical files
3. Document recovery procedures in case of access issues
4. Store founder credentials securely

## Verification Checklist

After completing these steps, verify:

- [ ] Repository shows "Private" badge on GitHub
- [ ] Fork button is disabled/hidden
- [ ] Only approved collaborators have access
- [ ] Branch protection rules are active
- [ ] GitHub Actions workflows run successfully
- [ ] Vercel deployment works with private repo
- [ ] Public documentation site displays correctly
- [ ] No sensitive data (API keys, credentials) in repository
- [ ] All contributors have signed legal agreements
- [ ] Founder has admin access

## Important Notes

1. **Never commit sensitive data**: Use environment variables and GitHub Secrets
2. **Review PR carefully**: Even from approved contributors, review all code before merging
3. **Audit logs**: Regularly check Settings → Security log for suspicious activity
4. **Revoke access**: Immediately remove contributors who violate terms
5. **Document everything**: Keep records of who has access and why

## Support

For access requests or security concerns:
- Telegram: @ElmahrosaPi
- Email: ayman@teosegypt.com
- Security issues: Open a private security advisory on GitHub

---

**Founder Declaration**: This repository is governed by Ayman Seif, Elmahrosa International (Est. 2007), under Egyptian law with venue in Alexandria.
