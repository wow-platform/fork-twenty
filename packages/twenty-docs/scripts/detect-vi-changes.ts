import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const docsRoot = path.resolve(__dirname, '..');
const checksumsPath = path.join(__dirname, 'detect-vi-changes.checksums.json');
const SOURCE_DIRS = ['user-guide', 'developers', 'twenty-ui'];

type ChecksumMap = Record<string, string>;
type ChangeType = 'new' | 'updated' | 'deleted';

const normalize = (content: string): string =>
  content.replace(/\r\n/g, '\n');

const md5 = (content: string): string =>
  crypto.createHash('md5').update(normalize(content)).digest('hex');

const collectMdxFiles = (dir: string, base: string): string[] => {
  const results: string[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(base, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      results.push(...collectMdxFiles(fullPath, relativePath));
    } else if (entry.name.endsWith('.mdx')) {
      results.push(relativePath);
    }
  }

  return results;
};

const loadChecksums = (): ChecksumMap => {
  if (!fs.existsSync(checksumsPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(checksumsPath, 'utf8')) as ChecksumMap;
};

const saveChecksums = (checksums: ChecksumMap): void => {
  const sorted = Object.keys(checksums)
    .sort()
    .reduce<ChecksumMap>((acc, key) => {
      acc[key] = checksums[key];

      return acc;
    }, {});

  fs.writeFileSync(checksumsPath, `${JSON.stringify(sorted, null, 2)}\n`);
};

const EXTRA_FILES = [
  'navigation/navigation.template.json',
];

const buildCurrentChecksums = (): ChecksumMap => {
  const checksums: ChecksumMap = {};

  for (const dir of SOURCE_DIRS) {
    const fullDir = path.join(docsRoot, dir);
    const files = collectMdxFiles(fullDir, dir);

    for (const file of files) {
      const content = fs.readFileSync(path.join(docsRoot, file), 'utf8');
      checksums[file] = md5(content);
    }
  }

  for (const file of EXTRA_FILES) {
    const fullPath = path.join(docsRoot, file);

    if (fs.existsSync(fullPath)) {
      checksums[file] = md5(fs.readFileSync(fullPath, 'utf8'));
    }
  }

  return checksums;
};

const detectChanges = (
  previous: ChecksumMap,
  current: ChecksumMap,
): Record<ChangeType, string[]> => {
  const changes: Record<ChangeType, string[]> = {
    new: [],
    updated: [],
    deleted: [],
  };

  for (const file of Object.keys(current)) {
    if (!(file in previous)) {
      changes.new.push(file);
    } else if (previous[file] !== current[file]) {
      changes.updated.push(file);
    }
  }

  for (const file of Object.keys(previous)) {
    if (!(file in current)) {
      changes.deleted.push(file);
    }
  }

  return changes;
};

const printReport = (changes: Record<ChangeType, string[]>): void => {
  const total = changes.new.length + changes.updated.length + changes.deleted.length;

  if (total === 0) {
    console.log('No changes detected. Vietnamese translations are up to date.');

    return;
  }

  console.log(`Detected ${total} change(s) in English source:\n`);

  if (changes.new.length > 0) {
    console.log('NEW:');

    for (const file of changes.new) {
      console.log(`  ${file}`);
      console.log(`    → Create: l/vi/${file}`);
    }

    console.log();
  }

  if (changes.updated.length > 0) {
    console.log('UPDATED:');

    for (const file of changes.updated) {
      console.log(`  ${file}`);
      console.log(`    → Update: l/vi/${file}`);
    }

    console.log();
  }

  if (changes.deleted.length > 0) {
    console.log('DELETED:');

    for (const file of changes.deleted) {
      console.log(`  ${file}`);
      console.log(`    → Remove: l/vi/${file}`);
    }

    console.log();
  }

  console.log(
    `Summary: ${changes.new.length} new, ${changes.updated.length} updated, ${changes.deleted.length} deleted`,
  );
};

// --- Main ---
const isSave = process.argv.includes('--save');
const previous = loadChecksums();
const current = buildCurrentChecksums();
const changes = detectChanges(previous, current);

printReport(changes);

if (isSave) {
  saveChecksums(current);
  console.log('\nChecksums saved to scripts/detect-vi-changes.checksums.json');
} else if (changes.new.length + changes.updated.length + changes.deleted.length > 0) {
  console.log('\nRun with --save after updating vi translations to persist checksums.');
}
