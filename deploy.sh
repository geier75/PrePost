#!/bin/bash

# ThinkBeforePost - Build & Deploy Script
# =========================================
# This script handles building and deploying the application
# to different environments (development, staging, production)

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ThinkBeforePost"
BUILD_DIR=".next"
EXTENSION_DIR="browser-extension"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js $(node --version) installed"
    
    # Check npm/yarn/pnpm
    if command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
        print_success "Using pnpm $(pnpm --version)"
    elif command -v yarn &> /dev/null; then
        PKG_MANAGER="yarn"
        print_success "Using yarn $(yarn --version)"
    else
        PKG_MANAGER="npm"
        print_success "Using npm $(npm --version)"
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker $(docker --version | cut -d' ' -f3) installed"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker not installed (optional)"
        DOCKER_AVAILABLE=false
    fi
    
    # Check Vercel CLI (for production)
    if command -v vercel &> /dev/null; then
        print_success "Vercel CLI installed"
        VERCEL_AVAILABLE=true
    else
        print_warning "Vercel CLI not installed (required for production deploy)"
        VERCEL_AVAILABLE=false
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    case $PKG_MANAGER in
        pnpm)
            pnpm install --frozen-lockfile
            ;;
        yarn)
            yarn install --frozen-lockfile
            ;;
        npm)
            npm ci
            ;;
    esac
    
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_header "Running Tests"
    
    # Lint
    echo "Running linter..."
    $PKG_MANAGER run lint || print_warning "Linting issues found"
    
    # Type check
    echo "Running type check..."
    $PKG_MANAGER run type-check || print_warning "Type errors found"
    
    # Unit tests
    if [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
        echo "Running unit tests..."
        $PKG_MANAGER test || print_warning "Some tests failed"
    fi
    
    print_success "Tests completed"
}

# Build application
build_app() {
    print_header "Building Application"
    
    # Clean previous build
    rm -rf $BUILD_DIR
    rm -rf .next
    
    # Set environment
    export NODE_ENV=production
    
    # Build Next.js app
    echo "Building Next.js application..."
    $PKG_MANAGER run build
    
    print_success "Application built successfully"
}

# Build browser extension
build_extension() {
    print_header "Building Browser Extension"
    
    cd $EXTENSION_DIR
    
    # Create manifest for different browsers
    echo "Creating extension package..."
    
    # Chrome/Edge
    zip -r ../extension-chrome.zip . \
        -x "*.git*" \
        -x "*.DS_Store" \
        -x "node_modules/*" \
        -x "*.map"
    
    print_success "Browser extension built"
    
    cd ..
}

# Build Docker image
build_docker() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        print_warning "Skipping Docker build (Docker not available)"
        return
    fi
    
    print_header "Building Docker Image"
    
    docker build -t thinkbeforepost:latest .
    docker tag thinkbeforepost:latest thinkbeforepost:$(git rev-parse --short HEAD)
    
    print_success "Docker image built"
}

# Deploy to development
deploy_dev() {
    print_header "Deploying to Development"
    
    # Start local development server
    $PKG_MANAGER run dev &
    DEV_PID=$!
    
    print_success "Development server started (PID: $DEV_PID)"
    echo "Access at: http://localhost:3000"
    
    # Wait for user to stop
    read -p "Press Enter to stop development server..."
    kill $DEV_PID
}

# Deploy to staging
deploy_staging() {
    print_header "Deploying to Staging"
    
    if [ "$VERCEL_AVAILABLE" = false ]; then
        print_error "Vercel CLI required for staging deployment"
        exit 1
    fi
    
    # Deploy to Vercel preview
    vercel --env=preview
    
    print_success "Deployed to staging"
}

# Deploy to production
deploy_production() {
    print_header "Deploying to Production"
    
    # Confirmation
    echo -e "${YELLOW}⚠️  WARNING: You are about to deploy to PRODUCTION!${NC}"
    read -p "Are you sure? (type 'yes' to confirm): " confirmation
    
    if [ "$confirmation" != "yes" ]; then
        print_error "Production deployment cancelled"
        exit 1
    fi
    
    # Check if on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_error "Must be on 'main' branch for production deploy (current: $CURRENT_BRANCH)"
        exit 1
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_error "Uncommitted changes detected. Please commit or stash them first."
        exit 1
    fi
    
    if [ "$VERCEL_AVAILABLE" = true ]; then
        # Deploy to Vercel
        print_header "Deploying to Vercel Production"
        vercel --prod
        print_success "Deployed to Vercel production"
    fi
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        # Push Docker image
        print_header "Pushing Docker Image"
        docker push thinkbeforepost:latest
        docker push thinkbeforepost:$(git rev-parse --short HEAD)
        print_success "Docker image pushed"
    fi
    
    # Deploy database migrations
    print_header "Running Database Migrations"
    # Add your migration command here
    # npm run migrate:prod
    
    print_success "Production deployment completed!"
}

# Create backup
create_backup() {
    print_header "Creating Backup"
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup code
    git archive --format=tar.gz -o "$BACKUP_DIR/code.tar.gz" HEAD
    
    # Backup environment files
    cp .env* "$BACKUP_DIR/" 2>/dev/null || true
    
    # Backup database schema
    cp -r database "$BACKUP_DIR/" 2>/dev/null || true
    
    print_success "Backup created in $BACKUP_DIR"
}

# Main menu
show_menu() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║       ThinkBeforePost - Build & Deploy   ║"
    echo "╠══════════════════════════════════════════╣"
    echo "║  1. Full Build (App + Extension)         ║"
    echo "║  2. Build App Only                       ║"
    echo "║  3. Build Extension Only                 ║"
    echo "║  4. Build Docker Image                   ║"
    echo "║  5. Deploy to Development                ║"
    echo "║  6. Deploy to Staging                    ║"
    echo "║  7. Deploy to Production                 ║"
    echo "║  8. Run Tests                            ║"
    echo "║  9. Create Backup                        ║"
    echo "║  0. Exit                                 ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Main execution
main() {
    clear
    print_header "ThinkBeforePost Build & Deploy System"
    
    # Check prerequisites
    check_prerequisites
    
    # Show menu if no arguments
    if [ $# -eq 0 ]; then
        while true; do
            show_menu
            read -p "Select option: " option
            
            case $option in
                1)
                    install_dependencies
                    run_tests
                    build_app
                    build_extension
                    build_docker
                    ;;
                2)
                    install_dependencies
                    build_app
                    ;;
                3)
                    build_extension
                    ;;
                4)
                    build_docker
                    ;;
                5)
                    deploy_dev
                    ;;
                6)
                    build_app
                    deploy_staging
                    ;;
                7)
                    install_dependencies
                    run_tests
                    build_app
                    build_extension
                    deploy_production
                    ;;
                8)
                    run_tests
                    ;;
                9)
                    create_backup
                    ;;
                0)
                    echo "Exiting..."
                    exit 0
                    ;;
                *)
                    print_error "Invalid option"
                    ;;
            esac
            
            echo
            read -p "Press Enter to continue..."
            clear
        done
    else
        # Handle command line arguments
        case $1 in
            build)
                install_dependencies
                run_tests
                build_app
                build_extension
                ;;
            test)
                run_tests
                ;;
            dev)
                deploy_dev
                ;;
            staging)
                build_app
                deploy_staging
                ;;
            production|prod)
                install_dependencies
                run_tests
                build_app
                build_extension
                deploy_production
                ;;
            *)
                print_error "Unknown command: $1"
                echo "Usage: $0 [build|test|dev|staging|production]"
                exit 1
                ;;
        esac
    fi
    
    print_success "All done! 🚀"
}

# Run main function
main "$@"