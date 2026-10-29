#!/bin/bash
set -euo pipefail
export PATH="$HOME/.rbenv/shims:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[$(date '+%F %T')] start"
cd "$ROOT/navermap-scraper"
rm -f stats_map.json
uv run refresh_stats.py
cd "$ROOT/scola-api"
bundle exec rails 'places:update_stats[../navermap-scraper/stats_map.json]'
echo "[$(date '+%F %T')] done"
