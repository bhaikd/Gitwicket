# Helper script to push all commits to GitHub one by one
# This ensures 54+ individual push events for maximum granularity

$commits = git log --reverse --format="%H" main
$total = ($commits | Measure-Object).Count
$idx = 0

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Pushing $total commits one by one to GitHub (bhaikd/Gitwicket)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

foreach ($commit in $commits) {
    $idx++
    $msg = git log -1 --format="%s" $commit
    Write-Host "[$idx/$total] Pushing: $msg ($($commit.Substring(0,7)))..." -ForegroundColor Yellow
    git push origin "$($commit):refs/heads/main"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed or interrupted at commit $commit" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host "All $total commits pushed successfully to https://github.com/bhaikd/Gitwicket.git!" -ForegroundColor Green
