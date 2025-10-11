#!/bin/bash

###############################################################################
# Storage Copy Helper Script
# 
# Copies storage files from migrations/export/storage/ to public/uploads/
# and sets appropriate permissions
# 
# Usage: 
#   bash migrations/storage_copy_helper.sh
#   
# Or with custom paths:
#   bash migrations/storage_copy_helper.sh <source_dir> <dest_dir>
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${1:-$SCRIPT_DIR/export/storage}"
DEST_DIR="${2:-$(dirname "$SCRIPT_DIR")/public/uploads}"

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Storage File Copy Helper${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}\n"

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ Source directory not found: $SOURCE_DIR${NC}"
    echo -e "${YELLOW}Run export first: npm run migrate:export${NC}"
    exit 1
fi

# Count files
FILE_COUNT=$(find "$SOURCE_DIR" -type f | wc -l)
echo -e "${BLUE}📦 Found $FILE_COUNT files to copy${NC}\n"

if [ "$FILE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No files to copy${NC}"
    exit 0
fi

# Create destination directory
echo -e "${BLUE}📁 Creating destination: $DEST_DIR${NC}"
mkdir -p "$DEST_DIR"

# Copy files
echo -e "${BLUE}📋 Copying files...${NC}"
cp -r "$SOURCE_DIR"/* "$DEST_DIR/" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Some files may have failed to copy${NC}"
}

# Set permissions (Linux/Mac only)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo -e "${BLUE}🔒 Setting permissions...${NC}"
    chmod -R 755 "$DEST_DIR"
fi

# Count copied files
COPIED_COUNT=$(find "$DEST_DIR" -type f | wc -l)

echo -e "\n${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Copy complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}📦 Copied $COPIED_COUNT files${NC}"
echo -e "${GREEN}📁 Destination: $DEST_DIR${NC}\n"

# Verify
if [ "$FILE_COUNT" -ne "$COPIED_COUNT" ]; then
    echo -e "${YELLOW}⚠️  Warning: File counts don't match${NC}"
    echo -e "${YELLOW}   Source: $FILE_COUNT | Destination: $COPIED_COUNT${NC}"
    exit 1
fi

exit 0
