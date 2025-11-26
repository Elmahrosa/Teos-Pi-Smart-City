"""
Governance Dashboard Generator for Teos&Pi Smart City Elmahrosa
Owner & Founder: Ayman Seif — Elmahrosa International (Est. 2007)

This script generates a public governance dashboard by fetching petition data
from GitHub Issues and formatting it into a MkDocs-compatible Markdown file.
"""

import requests
import os
from datetime import datetime
from collections import Counter
from pathlib import Path

# Constants
REPO = "Elmahrosa/Teos-Pi-Smart-City"
API = f"https://api.github.com/repos/{REPO}"
REPO_LINK = f"https://github.com/{REPO}"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

FAQ_SECTION = """
## ❓ Help & FAQ

???+ note "How do I create a petition?"
    Open a new issue in the Governance Repository with the **petition** label.

???+ note "How do I vote?"
    Comment on an open petition with `+1` (support) or `-1` (oppose).

???+ note "What happens after a petition is Ready for Review?"
    Once a petition reaches the support threshold, it moves to review and decision by contributors.

???+ note "Who is the founder?"
    **Ayman Seif** — Owner & Founder of Elmahrosa International (Est. 2007)
"""

def get_github_data(endpoint):
    """Fetch data from GitHub API with authentication."""
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(f"{API}/{endpoint}", headers=headers)
    response.raise_for_status()
    return response.json()

def get_petitions():
    """Fetch all petitions from GitHub Issues labeled 'petition'."""
    issues = get_github_data("issues?state=all&labels=petition")
    active, archived = [], []
    
    for issue in issues:
        petition = {
            "title": issue["title"],
            "url": issue["html_url"],
            "author": issue["user"]["login"],
            "status": "In Progress" if issue["state"] == "open" else "Closed",
            "support": 0,
            "oppose": 0,
            "comments": issue["comments"],
            "created_at": issue["created_at"],
            "closed_at": issue.get("closed_at"),
            "comments_data": get_github_data(f"issues/{issue['number']}/comments")
        }
        
        # Count votes from comments
        for c in petition["comments_data"]:
            if "+1" in c["body"].lower():
                petition["support"] += 1
            elif "-1" in c["body"].lower():
                petition["oppose"] += 1
        
        if issue["state"] == "open":
            active.append(petition)
        else:
            archived.append(petition)
    
    return active, archived

def calculate_metrics(active, archived):
    """Calculate governance metrics from petition data."""
    total = len(active) + len(archived)
    passed = sum(1 for p in archived if p["support"] > p["oppose"])
    rejected = len(archived) - passed
    
    durations = []
    for p in archived:
        if p["closed_at"] and p["created_at"]:
            start = datetime.fromisoformat(p["created_at"].replace("Z", ""))
            end = datetime.fromisoformat(p["closed_at"].replace("Z", ""))
            durations.append((end - start).days)
    
    avg_resolution = f"{sum(durations)/len(durations):.1f} days" if durations else "N/A"
    
    return {
        "Total Active Petitions": len(active),
        "Total Archived Petitions": len(archived),
        "Average Time to Resolution": avg_resolution,
        "Pass Rate": f"{passed/total:.0%}" if total else "N/A",
        "Reject Rate": f"{rejected/total:.0%}" if total else "N/A",
        "Contributor Participation": f"{sum(p['support']+p['oppose'] for p in active+archived)} votes"
    }

def calculate_top_contributors(active, archived):
    """Calculate top petition authors and voters."""
    # Count petition authors
    authors = [p["author"] for p in active + archived]
    
    # Count voters from comments (support/oppose)
    voters = []
    for p in active + archived:
        for c in p.get("comments_data", []):
            voters.append(c["user"]["login"])
    
    author_counts = Counter(authors)
    voter_counts = Counter(voters)
    
    top_authors = author_counts.most_common(3)
    top_voters = voter_counts.most_common(3)
    
    return top_authors, top_voters

def get_recent_outcomes(archived, limit=5):
    """Get most recent petition outcomes with dates."""
    # Sort archived petitions by closed date (most recent first)
    recent = sorted(
        [p for p in archived if p["closed_at"]],
        key=lambda x: x["closed_at"],
        reverse=True
    )[:limit]
    
    outcomes = []
    for p in recent:
        if p["support"] > p["oppose"]:
            outcome = "Passed"
        elif p["oppose"] > p["support"]:
            outcome = "Rejected"
        else:
            outcome = "Undecided"
        outcomes.append(f"- [{p['title']}]({p['url']}): {outcome} on {p['closed_at']}")
    
    return "\n".join(outcomes) if outcomes else "- No recent outcomes"

def generate_petition_table(petitions, archived=False):
    """Generate Markdown table rows for petitions."""
    rows = []
    for p in petitions:
        if archived:
            row = f"| [{p['title']}]({p['url']}) | @{p['author']} | <span class=\"outcome-{p['status'].lower().replace(' ','')}\">{p['status']}</span> | {p['support']} | {p['oppose']} | {p['closed_at'] or 'N/A'} |"
        else:
            row = f"| [{p['title']}]({p['url']}) | @{p['author']} | <span class=\"outcome-{p['status'].lower().replace(' ','')}\">{p['status']}</span> | {p['support']} | {p['oppose']} | {p['comments']} comments |"
        rows.append(row)
    return "\n".join(rows) if rows else "| No petitions | - | - | - | - | - |"

def generate_metrics_table(metrics):
    """Generate Markdown table for governance metrics."""
    return "\n".join(f"| {k} | {v} |" for k, v in metrics.items())

def generate_dashboard_content(active, archived, metrics, top_authors, top_voters, recent_outcomes):
    """Generate complete Markdown content for governance dashboard."""
    return f"""---
title: Governance Dashboard
---

# Governance Dashboard

**Owner & Founder:** Ayman Seif — Elmahrosa International (Est. 2007)

For full participation, visit the [Governance Repository]({REPO_LINK}).

_Last updated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC_

---

## Active Petitions

???+ note "🛠️ Petitions in Progress"

    | Title | Author | Status | Support | Oppose | Comments |
    |-------|--------|--------|---------|--------|----------|
    {generate_petition_table(active)}

---

## Archived Petitions

???+ note "🗃️ Archived Petitions (Last 90 Days)"

    | Title | Author | Status | Support | Oppose | Closed At |
    |-------|--------|--------|---------|--------|-----------|
    {generate_petition_table(archived, archived=True)}

---

## Governance Metrics

| Metric | Value |
|--------|-------|
{generate_metrics_table(metrics)}

---

## 📈 Recent Activity

### Top Petition Authors
{chr(10).join([f"- @{author}: {count} petitions" for author, count in top_authors]) if top_authors else "- No authors yet"}

### Top Voters
{chr(10).join([f"- @{voter}: {count} votes" for voter, count in top_voters]) if top_voters else "- No voters yet"}

### Recent Outcomes
{recent_outcomes}

---

{FAQ_SECTION}
"""

def main():
    """Main execution function."""
    print("Fetching petition data from GitHub...")
    active, archived = get_petitions()
    
    print(f"Found {len(active)} active and {len(archived)} archived petitions")
    
    metrics = calculate_metrics(active, archived)
    top_authors, top_voters = calculate_top_contributors(active, archived)
    recent_outcomes = get_recent_outcomes(archived)
    
    print("Generating dashboard content...")
    content = generate_dashboard_content(active, archived, metrics, top_authors, top_voters, recent_outcomes)
    
    # Ensure docs directory exists
    Path("docs").mkdir(exist_ok=True)
    
    Path("docs/dashboard.md").write_text(content, encoding="utf-8")
    
    print("Dashboard updated successfully at docs/dashboard.md")

if __name__ == "__main__":
    main()
