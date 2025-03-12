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

// Utility function to copy directory recursively
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.error(`Source directory not found: ${src}`);
    return false;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!copyDir(srcPath, destPath)) {
        return false;
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  return true;
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
  const serverDir = path.join(__dirname, 'server');
  const uploadsDir = path.join(serverDir, 'uploads');
  const clientBuildSrc = path.join(__dirname, 'client', 'dist');
  const clientBuildDest = path.join(serverDir, 'client', 'dist');

  ensureDir(uploadsDir);
  ensureDir(path.dirname(clientBuildDest));

  // Copy client build to server directory
  console.log('\nCopying client build to server directory...');
  console.log('From:', clientBuildSrc);
  console.log('To:', clientBuildDest);

  if (fs.existsSync(clientBuildSrc)) {
    if (copyDir(clientBuildSrc, clientBuildDest)) {
      console.log('Successfully copied client build to server directory');
    } else {
      console.error('Failed to copy client build');
      process.exit(1);
    }
  } else {
    console.error('Client build directory not found at:', clientBuildSrc);
    process.exit(1);
  }

  console.log('\nBuild completed successfully!');
}

// Ensure required directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
  }
};

build().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
}); 