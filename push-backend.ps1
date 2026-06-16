# push-backend.ps1
# Usage: run from repository root. Supports GitHub CLI auth or GITHUB_TOKEN env var (PAT).

$REMOTE_URL = "https://github.com/Thanusree7744/Worklink-Ai.git"
$BRANCH = "add-fastapi-backend"
$COMMIT_MSG = "Add FastAPI backend: models, auth, jobs, recommendations, uploads, alembic, docker"

function Ensure-Git {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "git CLI not found. Install Git: https://git-scm.com/download/win"
        exit 1
    }
}

function Ensure-InRepo {
    if (-not (Test-Path ".git")) {
        Write-Host "No .git found - initializing repository and setting remote to $REMOTE_URL"
        git init
        git remote add origin $REMOTE_URL
    }
}

function Configure-User {
    $user = git config user.name
    if (-not $user) {
        Write-Host "Configuring git user.name and user.email (change these after if needed)"
        git config user.name "Your Name"
        git config user.email "you@example.com"
    }
}

function Commit-And-Push {
    git checkout -B $BRANCH
    git add backend
    git commit -m "$COMMIT_MSG" | Out-Null

    # Prefer GitHub CLI when available & authenticated
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        gh auth status 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Using gh CLI to push"
            git push -u origin $BRANCH
            return
        }
    }

    # If a token is provided in env, use it for a one-time push
    if ($env:GITHUB_TOKEN) {
        $secureRemote = $REMOTE_URL -replace "https://", "https://$($env:GITHUB_TOKEN)@"
        git remote set-url origin $secureRemote
        git push -u origin $BRANCH
        # restore remote to non-token URL
        git remote set-url origin $REMOTE_URL
        return
    }

    Write-Host "Pushing - you may be prompted for credentials."
    git push -u origin $BRANCH
}

Ensure-Git
Ensure-InRepo
Configure-User
Commit-And-Push

Write-Host "Done. Create a PR on GitHub from branch '$BRANCH' to merge into main when ready."
