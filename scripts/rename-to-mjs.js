const fs = require('fs');
const path = require('path');

function renameFilesInDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // Collect info about existing files first
    const existingFiles = new Map();
    const existingDirs = new Set();

    function collectFileInfo(currentDir) {
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(currentDir, item.name);
            const relativePath = path.relative(dir, fullPath);

            if (item.isDirectory()) {
                existingDirs.add(relativePath);
                collectFileInfo(fullPath);
            } else if (item.isFile() && item.name.endsWith('.js')) {
                existingFiles.set(relativePath, item.name);
            }
        }
    }

    collectFileInfo(dir);

    // First rename all JS files to MJS
    function renameJsToMjs(currentDir) {
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(currentDir, item.name);

            if (item.isDirectory()) {
                renameJsToMjs(fullPath);
            } else if (item.isFile() && item.name.endsWith('.js')) {
                const newPath = fullPath.replace(/\.js$/, '.mjs');
                fs.renameSync(fullPath, newPath);
            }
        }
    }

    renameJsToMjs(dir);

    // Then update import paths in all MJS files
    function updateImports(currentDir) {
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(currentDir, item.name);

            if (item.isDirectory()) {
                updateImports(fullPath);
            } else if (item.isFile() && item.name.endsWith('.mjs')) {
                let content = fs.readFileSync(fullPath, 'utf8');

                content = content.replace(/from\s+["']([^"']+)["']/g, (match, importPath) => {
                    // Skip non-relative imports (node modules)
                    if (!importPath.startsWith('.') && !importPath.includes('/')) {
                        return match;
                    }

                    // Add ./ for relative paths if missing
                    let normalizedPath = importPath;
                    if (!normalizedPath.startsWith('.') && (normalizedPath.includes('/') || !normalizedPath.includes('/'))) {
                        normalizedPath = './' + normalizedPath;
                    }

                    // Resolve the import path relative to current file's directory
                    const currentFileDir = path.dirname(fullPath);
                    const targetPath = path.resolve(currentFileDir, normalizedPath);
                    const relativeToBaseDir = path.relative(dir, targetPath);

                    // Check if this import path points to a JS file we renamed
                    const jsFile = relativeToBaseDir + '.js';
                    const jsFileNoExt = relativeToBaseDir;

                    if (existingFiles.has(jsFile) || existingFiles.has(jsFileNoExt)) {
                        // Direct file import - add .mjs extension
                        return `from "${normalizedPath}.mjs"`;
                    }

                    // Check if it points to a directory that might have an index.js
                    for (const dirPath of existingDirs) {
                        if (dirPath === relativeToBaseDir) {
                            // It's a directory, check if it has an index.js
                            const indexPath = path.join(dirPath, 'index.js');
                            if (existingFiles.has(indexPath)) {
                                return `from "${normalizedPath}/index.mjs"`;
                            }
                        }
                    }

                    // If we can't determine exact path, just add .mjs extension as best guess
                    if (!importPath.endsWith('.mjs') && !importPath.endsWith('.js')) {
                        return `from "${importPath}.mjs"`;
                    } else if (importPath.endsWith('.js')) {
                        return `from "${importPath.replace(/\.js$/, '.mjs')}"`;
                    }

                    return match;
                });

                fs.writeFileSync(fullPath, content);
            }
        }
    }

    updateImports(dir);
}

const esmDir = path.resolve(__dirname, '../dist/esm');
renameFilesInDir(esmDir);
console.log('Successfully renamed .js to .mjs and updated imports');