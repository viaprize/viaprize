#!/usr/bin/env sh

# Get the list of files to be pushed
commits_to_push=$(git log $(git rev-parse @{u}..) --pretty=format:"%H")

# Get the list of files that have changes in the unpushed commits
files_to_push=$(git diff --name-only $commits_to_push)

commit_messages=$(git log --pretty=format:"%s" $(git rev-parse @{u}..))

echo "Commits to push:"
echo "$commit_messages"

echo "Files with changes: $files_to_push"

# Flag to track if changes are found
changes_found=false

# Iterate through the list of files
for file in $files_to_push; do
    # Check if the file is in the 'backend' directory
    if echo "$file" | grep -q "^backend/"; then
        echo "Building backend..."
        (cd backend && pnpm run build) || {
            echo '❌👷🔨❌ Better call Bob... Because your backend build failed ❌👷🔨❌
                Backend build failed: View the errors above to see why.'
            exit 1
        }
        changes_found=true
    fi

    # Check if the file is in the 'client' directory
    if echo "$file" | grep -q "^apps/client/"; then
        echo "Building client..."
        (cd apps/client && pnpm run build) || {
            echo '❌👷🔨❌ Better call Bob... Because your client build failed ❌👷🔨❌
                Client build failed: View the errors above to see why.'
            exit 1
        }
        changes_found=true
    fi

    # Check if the file is in the 'contracts' directory
    if echo "$file" | grep -q "^apps/contracts/"; then
        echo "Changes made to contracts."
        changes_found=true
    fi
done

# If changes are found, push the code
if [ "$changes_found" = true ]; then
    echo '✅ Awesome good code, I am pushing it to your branch now 🚀🚀🚀'
    exit 0
else
    echo 'No changes found in specified directories. Nothing to push.'
    exit 1
fi
