#!/bin/bash

# Local Database Management Script for LUCI
# Manages the local Supabase instance

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[LUCI DB]${NC} $1"
}

# Function to start Supabase
start_db() {
    print_header "Starting local Supabase..."
    cd "$(dirname "$0")/.." || exit 1
    supabase start
    if [ $? -eq 0 ]; then
        print_status "Supabase started successfully!"
        echo ""
        print_status "Connection details:"
        supabase status
    else
        print_error "Failed to start Supabase"
        exit 1
    fi
}

# Function to stop Supabase
stop_db() {
    print_header "Stopping local Supabase..."
    cd "$(dirname "$0")/.." || exit 1
    supabase stop
    if [ $? -eq 0 ]; then
        print_status "Supabase stopped successfully!"
    else
        print_error "Failed to stop Supabase"
        exit 1
    fi
}

# Function to show status
show_status() {
    print_header "Local Supabase Status"
    cd "$(dirname "$0")/.." || exit 1
    supabase status
}

# Function to reset database
reset_db() {
    print_warning "This will reset the local database and reapply all migrations. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_header "Resetting local database..."
        cd "$(dirname "$0")/.." || exit 1
        supabase db reset
        if [ $? -eq 0 ]; then
            print_status "Database reset complete!"
        else
            print_error "Failed to reset database"
            exit 1
        fi
    else
        print_status "Database reset cancelled."
    fi
}

# Function to open Supabase Studio
open_studio() {
    print_header "Opening Supabase Studio..."
    cd "$(dirname "$0")/.." || exit 1
    supabase status | grep "Studio URL" | awk '{print $3}' | xargs open 2>/dev/null || \
    print_status "Studio URL: http://127.0.0.1:54333"
}

# Function to show help
show_help() {
    echo "Local Database Management Script for LUCI"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  start      - Start local Supabase instance"
    echo "  stop       - Stop local Supabase instance"
    echo "  status     - Show Supabase status and connection details"
    echo "  reset      - Reset database and reapply migrations"
    echo "  studio     - Open Supabase Studio in browser"
    echo "  help       - Show this help message"
    echo ""
    echo "Note: Make sure Docker is running before starting Supabase"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_db
        ;;
    "stop")
        stop_db
        ;;
    "status")
        show_status
        ;;
    "reset")
        reset_db
        ;;
    "studio")
        open_studio
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

