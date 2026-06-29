function toPathSegments(filePath?: string | null) {
  return (filePath ?? 'file')
    .trim()
    .replaceAll('\\', '/')
    .replace(/^['"]|['"]$/g, '')
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== '.');
}

export function normalizeFileAssetPath(filePath?: string | null) {
  const segments = toPathSegments(filePath);

  const publicIndex = segments.indexOf('public');
  const relativeSegments =
    publicIndex >= 0 ? segments.slice(publicIndex + 1) : segments;

  if (relativeSegments.length === 0) {
    return '/file';
  }

  return `/${relativeSegments.join('/')}`;
}

export function resolveStoredFileAssetPath(filePath?: string | null) {
  const segments = toPathSegments(filePath);

  if (segments.length === 0) {
    return '/file';
  }

  return `/${segments.join('/')}`;
}

export function buildFileAssetUrl(
  filePath: string | null | undefined,
  storageName: string,
) {
  return `${resolveStoredFileAssetPath(filePath)}/${encodeURIComponent(storageName)}`;
}
