#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  let fileCount = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(path.join(currentPath, file));
      });
    } else {
      totalSize += stats.size;
      fileCount++;
    }
  }
  
  if (fs.existsSync(dirPath)) {
    calculateSize(dirPath);
  }
  
  return { size: totalSize, fileCount };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzePackage(packagePath, packageName) {
  console.log(`\n=== ${packageName} Analysis ===`);
  
  // Analyze node_modules
  const nodeModulesPath = path.join(packagePath, 'node_modules');
  const nodeModulesStats = getDirectorySize(nodeModulesPath);
  console.log(`📦 node_modules: ${formatBytes(nodeModulesStats.size)} (${nodeModulesStats.fileCount} files)`);
  
  // Analyze source code
  const srcPath = path.join(packagePath, 'src');
  const srcStats = getDirectorySize(srcPath);
  console.log(`📁 Source code: ${formatBytes(srcStats.size)} (${srcStats.fileCount} files)`);
  
  // Analyze package.json dependencies
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
    console.log(`📋 Dependencies: ${depCount} production, ${devDepCount} development`);
    
    // List main dependencies
    if (packageJson.dependencies) {
      console.log('🔧 Main dependencies:');
      Object.keys(packageJson.dependencies).forEach(dep => {
        console.log(`   - ${dep}@${packageJson.dependencies[dep]}`);
      });
    }
  }
  
  return {
    nodeModulesSize: nodeModulesStats.size,
    srcSize: srcStats.size,
    totalSize: nodeModulesStats.size + srcStats.size
  };
}

function main() {
  console.log('🔍 Package Size Comparison Analysis');
  console.log('====================================');
  
  const mainPackagePath = path.join(__dirname, 'packages', 'main');
  const aasCliPath = path.join(__dirname, 'packages', 'aas-cli');
  
  const mainStats = analyzePackage(mainPackagePath, 'Full Datadog CI Package');
  const aasCliStats = analyzePackage(aasCliPath, 'Minimal AAS CLI Package');
  
  console.log('\n=== Comparison Summary ===');
  console.log(`📊 Size reduction: ${formatBytes(mainStats.totalSize - aasCliStats.totalSize)} (${((1 - aasCliStats.totalSize / mainStats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`📦 node_modules reduction: ${formatBytes(mainStats.nodeModulesSize - aasCliStats.nodeModulesSize)} (${((1 - aasCliStats.nodeModulesSize / mainStats.nodeModulesSize) * 100).toFixed(1)}%)`);
  console.log(`📁 Source code reduction: ${formatBytes(mainStats.srcSize - aasCliStats.srcSize)} (${((1 - aasCliStats.srcSize / mainStats.srcSize) * 100).toFixed(1)}%)`);
  
  // Calculate dependency reduction
  const mainPackageJson = JSON.parse(fs.readFileSync(path.join(mainPackagePath, 'package.json'), 'utf8'));
  const aasCliPackageJson = JSON.parse(fs.readFileSync(path.join(aasCliPath, 'package.json'), 'utf8'));
  
  const mainDeps = Object.keys(mainPackageJson.dependencies || {}).length;
  const aasCliDeps = Object.keys(aasCliPackageJson.dependencies || {}).length;
  
  console.log(`🔧 Dependency reduction: ${mainDeps - aasCliDeps} packages (${((1 - aasCliDeps / mainDeps) * 100).toFixed(1)}%)`);
  
  console.log('\n=== Benefits of AAS CLI Package ===');
  console.log('✅ Smaller installation size');
  console.log('✅ Faster installation time');
  console.log('✅ Reduced attack surface');
  console.log('✅ Focused functionality');
  console.log('✅ Independent versioning');
  console.log('✅ Easier maintenance');
}

if (require.main === module) {
  main();
}