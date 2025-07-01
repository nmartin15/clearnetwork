# Setup development environment for ClearNet MCP

# Function to check if a command exists
function Command-Exists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Check for Node.js and pnpm
if (-not (Command-Exists "node")) {
    Write-Error "Node.js is not installed. Please install Node.js v16+ from https://nodejs.org/"
    exit 1
}

if (-not (Command-Exists "pnpm")) {
    Write-Output "Installing pnpm..."
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install pnpm"
        exit 1
    }
}

# Install root dependencies
Write-Output "Installing root dependencies..."
Set-Location $PSScriptRoot
pnpm install

# Install MCP package dependencies
Write-Output "Installing MCP package dependencies..."
Set-Location "$PSScriptRoot\packages\mcp"
pnpm install

# Build MCP package
Write-Output "Building MCP package..."
pnpm run build

# Install agents app dependencies
Write-Output "Installing agents app dependencies..."
Set-Location "$PSScriptRoot\apps\agents"
pnpm install

# Build agents app
Write-Output "Building agents app..."
pnpm run build

Write-Output ""
Write-Output "✅ Setup complete!"
Write-Output "To start the MCP server, run:"
Write-Output "  cd $PSScriptRoot\apps\agents"
Write-Output "  pnpm start"
