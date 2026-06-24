import { promises as fsPromise } from 'fs';
import path from 'path';

const projectDir = process.cwd();
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.vscode',
];
const MAX_SUBDIR_COUNT = 1;

async function getDirectories(baseDir: string, depth = 0) {
  if (depth > MAX_SUBDIR_COUNT) {
    return {};
  }

  const entries = await fsPromise.readdir(baseDir, { withFileTypes: true });
  const dirs = entries.filter(
    (entry) => entry.isDirectory() && !IGNORE_DIRS.includes(entry.name),
  );

  const subDirs: { [key: string]: any } = {}; // Add index signature

  for (const dir of dirs) {
    subDirs[dir.name] = await getDirectories(
      path.join(baseDir, dir.name),
      depth + 1,
    );
  }

  return subDirs;
}

export default async function TreeView() {
  const dirs = await getDirectories(projectDir);
  function renderDir(dirs: { [x: string]: any }) {
    return (
      <ul>
        {Object.keys(dirs).map((dirName) => (
          <li key={dirName}>
            {Object.keys(dirs[dirName]).length > 0 ? (
              <details>
                <summary>{dirName}</summary>
                {renderDir(dirs[dirName])}
              </details>
            ) : (
              <span>{dirName}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <>
      <ul className="tree">{renderDir(dirs)}</ul>
    </>
  );
}
