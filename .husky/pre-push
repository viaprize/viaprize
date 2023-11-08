#!/usr/bin/env sh

# Get the list of commits that are not yet pushed to the remote repository
commits_to_push=$(git log --pretty=format:"%H" $(git rev-parse @{u}..))

# Get the list of files that have changes in the unpushed commits
files_to_push=$(git diff --name-only $commits_to_push)

commit_messages=$(git log --pretty=format:"%s" $commits_to_push)

echo "Commits to push:"
echo "$commit_messages"

echo "Files with changes: $files_to_push"

# Array to track directories where build has been executed
built_directories=()

# Flag to track if changes are found
changes_found=false

# Iterate through the list of files
for file in $files_to_push; do

    # Check if the file is in the 'backend' directory
    if echo "$file" | grep -q "^backend/"; then
        # Check if the build has not been executed for this directory
        if ! echo "${built_directories[@]}" | grep -qw "backend"; then
            echo "Building backend..."
            (cd backend && pnpm run build) || {
                echo '❌👷🔨❌ Better call Bob... Because your backend build failed ❌👷🔨❌
                    Backend build failed: View the errors above to see why.'
                exit 1
            }
            # Mark the directory as built
            built_directories+=("backend")
            changes_found=true
        fi
    fi

    # Check if the file is in the 'client' directory
    if echo "$file" | grep -q "^apps/client/"; then
        # Check if the build has not been executed for this directory
        if ! echo "${built_directories[@]}" | grep -qw "client"; then
            echo "Building client..."
            (cd apps/client && pnpm run build) || {
                echo '❌👷🔨❌ Better call Bob... Because your client build failed ❌👷🔨❌
                    Client build failed: View the errors above to see why.'
                exit 1
            }
            # Mark the directory as built
            built_directories+=("client")
            changes_found=true
        fi
    fi

    # Check if the file is in the 'contracts' directory
    if echo "$file" | grep -q "^apps/contracts/"; then
        # Check if the build has not been executed for this directory
        if ! echo "${built_directories[@]}" | grep -qw "contracts"; then
            echo "Changes made to contracts."
            # Mark the directory as built
            built_directories+=("contracts")
            changes_found=true
        fi
    fi

done

# If changes are found, push the code
if [ "$changes_found" = true ]; then
    echo '✅ Awesome good code, I am pushing it to your branch now 🚀🚀🚀'
    exit 0
else
    echo 'No changes found in specified directories. Nothing to push.'
    exit 0
fi
