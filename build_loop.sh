#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# Ralph Loop -- Automated Build Loop for Claude Code
# =============================================================
# Repeatedly invokes Claude Code to work through TODO.md tasks
# one at a time. Each invocation picks the next unchecked task,
# implements it, marks it done, and exits.
#
# If a task fails (test failures, silent crashes, etc.), the loop
# marks it SKIPPED and moves on to the next task. After all other
# tasks are done (or on a second pass), skipped tasks are retried.
#
# Usage:
#   ./build_loop.sh              # Run with defaults
#   ./build_loop.sh --max 5      # Run at most 5 iterations
#   ./build_loop.sh --dry-run    # Show what would run without executing
#   ./build_loop.sh --pause 10   # 10s pause between iterations
#
# Prerequisites:
#   - Claude Code CLI installed (`claude` command available)
#   - CLAUDE.md, TODO.md, and COMPLETED.md in the project root
#   - A PROJECT_PLAN.md with detailed specs (optional but recommended)
# =============================================================

# --- Configuration ---
MAX_ITERATIONS=0          # 0 = unlimited
DRY_RUN=false
PAUSE_BETWEEN=5           # seconds between iterations
TODO_FILE="TODO.md"
LOG_DIR="build_logs"
MAX_RETRY_PASSES=2        # how many full passes to retry skipped tasks

# --- Parse arguments ---
while [[ $# -gt 0 ]]; do
  case $1 in
    --max)       MAX_ITERATIONS="$2"; shift 2 ;;
    --dry-run)   DRY_RUN=true; shift ;;
    --pause)     PAUSE_BETWEEN="$2"; shift 2 ;;
    *)           echo "Unknown option: $1"; exit 1 ;;
  esac
done

# --- Setup ---
mkdir -p "$LOG_DIR"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# --- Helper functions ---
count_remaining() {
  local n
  n=$(grep -c '^\- \[ \]' "$TODO_FILE" 2>/dev/null) || true
  echo "${n:-0}"
}

count_completed() {
  local n
  n=$(grep -c '^\- \[x\]' "$TODO_FILE" 2>/dev/null) || true
  echo "${n:-0}"
}

count_skipped() {
  local n
  n=$(grep -c '<!-- SKIPPED' "$TODO_FILE" 2>/dev/null) || true
  echo "${n:-0}"
}

# Get the next actionable task (unchecked AND not skipped)
get_next_task() {
  # Find lines that are unchecked and do NOT have a SKIPPED comment after them
  local line_nums
  line_nums=$(grep -n '^\- \[ \]' "$TODO_FILE" 2>/dev/null | cut -d: -f1)

  for line_num in $line_nums; do
    local next_line=$((line_num + 1))
    local following
    following=$(sed -n "${next_line}p" "$TODO_FILE" 2>/dev/null)
    # If the following line does NOT contain SKIPPED, this task is actionable
    if ! echo "$following" | grep -q '<!-- SKIPPED'; then
      sed -n "${line_num}p" "$TODO_FILE" | sed 's/^- \[ \] //'
      return 0
    fi
  done

  # No actionable tasks found
  return 1
}

get_task_id() {
  echo "$1" | grep -oE '[0-9]+\.[0-9]+' | head -1 || echo "unknown"
}

# Clear all SKIPPED markers for a retry pass
clear_skipped_markers() {
  # Remove lines that are just SKIPPED comments (<!-- SKIPPED: ... -->)
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' '/^<!-- SKIPPED:.*-->$/d' "$TODO_FILE"
  else
    sed -i '/^<!-- SKIPPED:.*-->$/d' "$TODO_FILE"
  fi
}

# Mark a task as skipped by adding a comment line after it
mark_skipped() {
  local task_id="$1"
  local reason="$2"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M')

  # Find the line number of this task
  local line_num
  line_num=$(grep -n "^\- \[ \] \*\*${task_id}" "$TODO_FILE" | head -1 | cut -d: -f1)

  if [[ -n "$line_num" ]]; then
    # Insert a SKIPPED comment on the line after the task
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "${line_num}a\\
<!-- SKIPPED: ${reason} (${timestamp}) -->" "$TODO_FILE"
    else
      sed -i "${line_num}a<!-- SKIPPED: ${reason} (${timestamp}) -->" "$TODO_FILE"
    fi
  fi
}

# --- Post-task build verification ---
verify_tests() {
  local log_file="$1"

  # Skip if package.json doesn't exist yet (pre-scaffold tasks)
  if [[ ! -f "package.json" ]]; then
    echo -e "${YELLOW}  [verify] package.json not found, skipping build verification${NC}"
    return 0
  fi

  # Skip if node_modules doesn't exist (deps not installed yet)
  if [[ ! -d "node_modules" ]]; then
    echo -e "${YELLOW}  [verify] node_modules not found, skipping build verification${NC}"
    return 0
  fi

  echo -e "${CYAN}  [verify] Running independent build verification (npm run build)...${NC}"

  local test_output
  local test_exit_code=0
  # Timeout after 120s to catch hangs; capture output
  test_output=$(timeout 120 npm run build 2>&1) || test_exit_code=$?

  # Save test output to log
  {
    echo ""
    echo "=== POST-TASK BUILD VERIFICATION ==="
    echo "$test_output"
    echo "Exit code: $test_exit_code"
  } >> "$log_file"

  # Exit code 124 = timeout killed it
  if [[ "$test_exit_code" -eq 124 ]]; then
    echo -e "${RED}  [verify] FAILED: Build timed out after 120s${NC}"
    return 1
  fi

  # Non-zero exit code
  if [[ "$test_exit_code" -ne 0 ]]; then
    echo -e "${RED}  [verify] FAILED: Build exited with code ${test_exit_code}${NC}"
    echo "$test_output" | grep -iE '(Error|error|FAIL)' | head -10
    return 1
  fi

  echo -e "${GREEN}  [verify] Build passed!${NC}"
  return 0
}

# --- Prompt sent to Claude Code ---
PROMPT='You are running inside the automated build loop. Follow the Auto-Build Mode protocol in CLAUDE.md exactly.

Summary:
1. Read TODO.md -- find the FIRST unchecked task (line starting with "- [ ]") that does NOT have a <!-- SKIPPED --> comment on the line below it
2. Read PROJECT_PLAN.md for detailed specs as needed for this task
3. Implement the task fully -- write code, run commands, verify it works
4. Mark the task done in TODO.md (change "- [ ]" to "- [x]")
5. Append a completion entry to COMPLETED.md with the task ID and summary
6. git add -A && git commit -m "task: <description>"
7. STOP -- do not continue to the next task

If the task fails and you cannot resolve it:
- Add <!-- SKIPPED: reason --> on the line after the task in TODO.md
- Do NOT mark it done
- Commit what you have and STOP

IMPORTANT: Do not delete or overwrite CLAUDE.md, PROJECT_PLAN.md, TODO.md, COMPLETED.md, or build_loop.sh.
IMPORTANT: Preserve existing assets in public/ (alabamy-wordmark.png, alabamy-icon.png, favicons).
IMPORTANT: Make decisions, do not ask questions. Keep output brief.'

# --- Allowed tools ---
ALLOWED_TOOLS="Bash(git commit:*),Bash(git add:*),Bash(git status:*),Bash(git diff:*),Bash(git log:*),Bash(npm *),Bash(npx *),Bash(node *),Bash(mkdir *),Bash(chmod *),Bash(ls *),Bash(cp *),Bash(mv *),Bash(touch *),Bash(curl *),Read,Write,Edit,Glob,Grep,NotebookEdit,TodoWrite"

# --- Main loop ---
echo -e "${BOLD}${CYAN}=============================================${NC}"
echo -e "${BOLD}${CYAN}  Ralph Loop -- Alabamy Build${NC}"
echo -e "${BOLD}${CYAN}=============================================${NC}"
echo ""

iteration=0
retry_pass=0

while true; do
  iteration=$((iteration + 1))
  remaining=$(count_remaining)
  completed=$(count_completed)
  skipped=$(count_skipped)
  total=$((remaining + completed))
  actionable=$((remaining - skipped))

  echo -e "${CYAN}--- Iteration ${iteration} ---${NC}"
  echo -e "Progress: ${GREEN}${completed}${NC}/${total} done, ${YELLOW}${actionable}${NC} actionable, ${RED}${skipped}${NC} skipped"
  echo ""

  # Check iteration limit
  if [[ "$MAX_ITERATIONS" -gt 0 && "$iteration" -gt "$MAX_ITERATIONS" ]]; then
    echo -e "${YELLOW}Reached max iterations (${MAX_ITERATIONS}). Stopping.${NC}"
    echo "${remaining} tasks remaining (${skipped} skipped)."
    exit 0
  fi

  # Check if all tasks are done
  if [[ "$remaining" -eq 0 ]]; then
    echo -e "${GREEN}All tasks complete!${NC}"
    echo "Build log files are in: ${LOG_DIR}/"
    exit 0
  fi

  # If no actionable tasks but some are skipped, start a retry pass
  if [[ "$actionable" -le 0 && "$skipped" -gt 0 ]]; then
    retry_pass=$((retry_pass + 1))

    if [[ "$retry_pass" -gt "$MAX_RETRY_PASSES" ]]; then
      echo -e "${RED}Completed ${MAX_RETRY_PASSES} retry passes. ${skipped} tasks still skipped.${NC}"
      echo ""
      echo "Remaining skipped tasks:"
      grep -A1 '^\- \[ \]' "$TODO_FILE" | grep 'SKIPPED' | head -20
      echo ""
      echo "To retry: remove <!-- SKIPPED --> comments from TODO.md and re-run."
      exit 1
    fi

    echo -e "${YELLOW}All actionable tasks done. Starting retry pass ${retry_pass}/${MAX_RETRY_PASSES} for ${skipped} skipped tasks...${NC}"
    echo ""
    clear_skipped_markers
    skipped=0
    actionable=$(count_remaining)
    continue
  fi

  # Get next actionable task
  next_task=$(get_next_task) || {
    echo -e "${YELLOW}No actionable tasks found. This shouldn't happen.${NC}"
    exit 1
  }
  next_task_id=$(get_task_id "$next_task")

  echo -e "Task: ${BOLD}${next_task}${NC}"
  echo ""

  # Dry run mode
  if [[ "$DRY_RUN" == true ]]; then
    echo "(dry-run: would invoke claude here)"
    echo ""
    exit 0
  fi

  # Build log filename
  timestamp=$(date +%Y%m%d_%H%M%S)
  log_file="${LOG_DIR}/task_${next_task_id}_${timestamp}.log"
  echo "Log: ${log_file}"
  echo ""

  # Invoke Claude Code
  claude --print \
    --verbose \
    --allowedTools "$ALLOWED_TOOLS" \
    -p "$PROMPT" \
    2>&1 | tee "$log_file"

  exit_code=${PIPESTATUS[0]}
  echo ""

  # --- Evaluate what happened ---

  # Check if Claude itself crashed
  if [[ $exit_code -ne 0 ]]; then
    echo -e "${RED}Claude exited with code ${exit_code}${NC}"
    echo -e "${YELLOW}Skipping task ${next_task_id} and moving on...${NC}"
    mark_skipped "$next_task_id" "Claude exited with code ${exit_code}"
    sleep 5
    continue
  fi

  # Check if the task was marked done
  new_remaining=$(count_remaining)
  if [[ "$new_remaining" -ge "$remaining" ]]; then
    # Task was NOT marked done
    if grep -q "<!-- SKIPPED.*${next_task_id}" "$TODO_FILE" 2>/dev/null; then
      echo -e "${YELLOW}Task ${next_task_id} was skipped by Claude. Moving on.${NC}"
    else
      echo -e "${YELLOW}Task ${next_task_id} was not completed. Marking as skipped.${NC}"
      mark_skipped "$next_task_id" "Task not marked done after Claude session"
    fi
    sleep 5
    continue
  fi

  # Task was marked done -- now verify build independently
  if ! verify_tests "$log_file"; then
    echo ""
    echo -e "${RED}POST-TASK BUILD VERIFICATION FAILED for ${next_task_id}${NC}"
    echo -e "${YELLOW}Keeping task marked done but noting the build failure.${NC}"
    echo -e "${YELLOW}Build issues often resolve as more tasks complete -- will be caught in final cleanup.${NC}"
    echo "$(date '+%Y-%m-%d %H:%M') -- Task ${next_task_id}: post-verification build failure (task kept as done)" >> "${LOG_DIR}/test_failures.log"
  fi

  echo -e "${GREEN}Task ${next_task_id} completed!${NC}"
  echo ""

  # Pause between iterations
  if [[ "$PAUSE_BETWEEN" -gt 0 ]]; then
    echo "Pausing ${PAUSE_BETWEEN}s..."
    sleep "$PAUSE_BETWEEN"
  fi

  echo ""
done
