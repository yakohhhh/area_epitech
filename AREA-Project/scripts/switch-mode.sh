#!/bin/bash

# CI/CD Mode Switcher
# Switch between Lite mode (free tier) and Full mode (paid)

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}
╔════════════════════════════════════════╗
║          CI/CD MODE SWITCHER           ║
╚════════════════════════════════════════╝
${NC}"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_help() {
    echo "Usage: $0 [lite|full|status]"
    echo ""
    echo "Commands:"
    echo "  lite    - Switch to Lite mode (GitHub Free tier)"
    echo "  full    - Switch to Full mode (requires paid plan)"
    echo "  status  - Show current mode"
    echo ""
    echo "Lite mode features:"
    echo "  ✓ Basic linting and type checking"
    echo "  ✓ Simple tests"
    echo "  ✓ Basic security checks"
    echo "  ✓ Docker builds on main only"
    echo "  ✗ No SonarQube/Snyk integration"
    echo "  ✗ No performance testing"
    echo "  ✗ Limited workflows"
    echo ""
    echo "Full mode features:"
    echo "  ✓ All Lite mode features"
    echo "  ✓ Complete test suites"
    echo "  ✓ SonarQube code quality"
    echo "  ✓ Snyk security scanning"
    echo "  ✓ Performance testing"
    echo "  ✓ Full deployment pipeline"
    echo "  ✓ Release management"
}

check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "Error: Not in a git repository"
        exit 1
    fi
}

get_current_mode() {
    if [ -f ".github/workflows/ci-lite.yml" ] && [ ! -f ".github/workflows/backend-ci.yml" ]; then
        echo "lite"
    elif [ -f ".github/workflows/backend-ci.yml" ] && [ ! -f ".github/workflows/ci-lite.yml" ]; then
        echo "full"
    else
        echo "mixed"
    fi
}

switch_to_lite() {
    print_info "Switching to Lite mode..."
    
    # Disable full workflows by renaming them
    for workflow in backend-ci.yml frontend-ci.yml mobile-ci.yml docker-build.yml quality-gates.yml deployment.yml release.yml; do
        if [ -f ".github/workflows/$workflow" ]; then
            mv ".github/workflows/$workflow" ".github/workflows/$workflow.disabled"
            print_info "Disabled: $workflow"
        fi
    done
    
    # Enable lite workflow
    if [ -f ".github/workflows/ci-lite.yml.disabled" ]; then
        mv ".github/workflows/ci-lite.yml.disabled" ".github/workflows/ci-lite.yml"
    fi
    
    print_info "✅ Switched to Lite mode"
    print_warning "This mode uses minimal GitHub Actions minutes"
    print_info "Commit and push changes to activate"
}

switch_to_full() {
    print_info "Switching to Full mode..."
    
    # Enable full workflows
    for workflow in backend-ci.yml frontend-ci.yml mobile-ci.yml docker-build.yml quality-gates.yml deployment.yml release.yml; do
        if [ -f ".github/workflows/$workflow.disabled" ]; then
            mv ".github/workflows/$workflow.disabled" ".github/workflows/$workflow"
            print_info "Enabled: $workflow"
        fi
    done
    
    # Disable lite workflow
    if [ -f ".github/workflows/ci-lite.yml" ]; then
        mv ".github/workflows/ci-lite.yml" ".github/workflows/ci-lite.yml.disabled"
    fi
    
    print_info "✅ Switched to Full mode"
    print_warning "This mode requires GitHub Actions paid plan for heavy usage"
    print_info "Make sure to configure required secrets:"
    echo "  - SNYK_TOKEN"
    echo "  - SONAR_TOKEN"
    print_info "Commit and push changes to activate"
}

show_status() {
    local mode=$(get_current_mode)
    
    echo "Current CI/CD mode: $mode"
    echo ""
    
    case $mode in
        "lite")
            echo "✓ Running in Lite mode (Free tier optimized)"
            echo "Active workflows:"
            echo "  - ci-lite.yml"
            ;;
        "full")
            echo "✓ Running in Full mode (Complete CI/CD)"
            echo "Active workflows:"
            ls .github/workflows/*.yml 2>/dev/null | while read workflow; do
                echo "  - $(basename $workflow)"
            done
            ;;
        "mixed")
            echo "⚠️  Mixed mode detected (some workflows enabled/disabled)"
            echo "Please run 'switch-mode lite' or 'switch-mode full'"
            ;;
    esac
    
    echo ""
    echo "GitHub Actions usage:"
    echo "  - Free tier: 2000 minutes/month"
    echo "  - Current month usage: Check GitHub billing settings"
}

main() {
    print_header
    
    check_git_repo
    
    case "${1:-}" in
        "lite")
            switch_to_lite
            ;;
        "full")
            switch_to_full
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            echo "Error: Unknown command '$1'"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"