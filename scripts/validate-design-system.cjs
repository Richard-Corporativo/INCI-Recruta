#!/usr/bin/env node

/**
 * INCI Design System Validation Script
 * Detects violations of INCI Design System v2.0.0 in candidate portal files
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = [
    'components',
    'pages',
    'layouts'
];

// Patterns to detect
const PATTERNS = {
    hexColors: /#[0-9a-fA-F]{3,6}/g,
    rgbColors: /rgb\([^)]+\)/g,
    hslColors: /hsl\([^)]+\)/g,
    inlineStyles: /style=\{\{/g,
    wrongButtonRadius: /className="[^"]*\b(button|Button)[^"]*\b(rounded-xl|rounded-2xl|rounded-3xl)\b[^"]*"/g,
    wrongInputRadius: /className="[^"]*\b(input|Input|textarea)[^"]*\b(rounded-base|rounded-lg|rounded-xl)\b[^"]*"/g,
    wrongCardRadius: /className="[^"]*\b(card|Card)[^"]*\b(rounded-base|rounded-md|rounded-xl|rounded-2xl)\b[^"]*"/g,
};

let totalViolations = 0;
const violations = [];

/**
 * Scan a file for design system violations
 */
function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fileViolations = [];

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Check for hardcoded HEX colors
        const hexMatches = line.match(PATTERNS.hexColors);
        if (hexMatches) {
            hexMatches.forEach(match => {
                fileViolations.push({
                    line: lineNumber,
                    type: 'Hardcoded HEX Color',
                    violation: match,
                    message: `Use CSS tokens instead of ${match}`
                });
            });
        }

        // Check for RGB colors
        const rgbMatches = line.match(PATTERNS.rgbColors);
        if (rgbMatches) {
            rgbMatches.forEach(match => {
                fileViolations.push({
                    line: lineNumber,
                    type: 'Hardcoded RGB Color',
                    violation: match,
                    message: `Use CSS tokens instead of ${match}`
                });
            });
        }

        // Check for HSL colors (not in CSS variables)
        const hslMatches = line.match(PATTERNS.hslColors);
        if (hslMatches && !line.includes('hsl(var(--')) {
            hslMatches.forEach(match => {
                fileViolations.push({
                    line: lineNumber,
                    type: 'Hardcoded HSL Color',
                    violation: match,
                    message: `Use CSS tokens instead of ${match}`
                });
            });
        }

        // Check for inline styles (except backgroundImage, width, animationDelay)
        if (line.match(PATTERNS.inlineStyles) && !line.includes('backgroundImage') && !line.includes('width:') && !line.includes('animationDelay')) {
            fileViolations.push({
                line: lineNumber,
                type: 'Inline Style',
                violation: 'style={{',
                message: 'Use Tailwind utility classes instead of inline styles'
            });
        }

        // Check for wrong button radius
        const buttonRadiusMatch = line.match(PATTERNS.wrongButtonRadius);
        if (buttonRadiusMatch) {
            fileViolations.push({
                line: lineNumber,
                type: 'Wrong Button Radius',
                violation: buttonRadiusMatch[0],
                message: 'Buttons must use rounded-base'
            });
        }

        // Check for wrong input radius
        const inputRadiusMatch = line.match(PATTERNS.wrongInputRadius);
        if (inputRadiusMatch) {
            fileViolations.push({
                line: lineNumber,
                type: 'Wrong Input Radius',
                violation: inputRadiusMatch[0],
                message: 'Inputs must use rounded-md'
            });
        }

        // Check for wrong card radius
        const cardRadiusMatch = line.match(PATTERNS.wrongCardRadius);
        if (cardRadiusMatch) {
            fileViolations.push({
                line: lineNumber,
                type: 'Wrong Card Radius',
                violation: cardRadiusMatch[0],
                message: 'Cards must use rounded-lg'
            });
        }
    });

    if (fileViolations.length > 0) {
        violations.push({
            file: filePath,
            violations: fileViolations
        });
        totalViolations += fileViolations.length;
    }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
    const fullPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(fullPath);

    files.forEach(file => {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanDirectory(path.join(dir, file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            scanFile(filePath);
        }
    });
}

/**
 * Main execution
 */
console.log('🔍 INCI Design System Validation\n');
console.log('Scanning candidate portal files...\n');

SCAN_DIRS.forEach(dir => {
    scanDirectory(dir);
});

// Report results
if (totalViolations === 0) {
    console.log('✅ No violations found! All files comply with INCI Design System v2.0.0\n');
    process.exit(0);
} else {
    console.log(`❌ Found ${totalViolations} violation(s) in ${violations.length} file(s):\n`);

    violations.forEach(({ file, violations: fileViolations }) => {
        console.log(`\n📄 ${file}`);
        fileViolations.forEach(({ line, type, violation, message }) => {
            console.log(`   Line ${line}: [${type}] ${message}`);
            console.log(`   → ${violation}`);
        });
    });

    console.log('\n❌ Validation failed. Please fix the violations above.\n');
    process.exit(1);
}
