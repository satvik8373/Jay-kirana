const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Utility function to execute commands
const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    return true;
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
};

// Ensure required directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Build process
async function build() {
  console.log('Starting production build process...');

  // Build client
  console.log('\nBuilding client...');
  const clientSuccess = runCommand('npm install && npm run build', './client');
  if (!clientSuccess) {
    console.error('Client build failed');
    process.exit(1);
  }

  // Ensure server directories
  console.log('\nPreparing server directories...');
  ensureDir('./server/uploads');
  
  // Copy client build to server's public directory if needed
  const clientBuildDir = path.join(__dirname, 'client', 'dist');
  if (fs.existsSync(clientBuildDir)) {
    console.log('Client build successful');
  } else {
    console.error('Client build directory not found');
    process.exit(1);
  }

  console.log('\nBuild completed successfully!');
}

build().catch(console.error); 