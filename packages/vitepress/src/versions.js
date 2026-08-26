export function defineDocsVersions(versions) {
  return Array.isArray(versions) ? versions : [];
}

export function getPathWithinVersion(pathname, version) {
  const normalizedPath = String(pathname || "");

  if (!version || version.prefix === "/") {
    return normalizedPath.replace(/^\//, "");
  }

  if (normalizedPath.startsWith(version.prefix)) {
    return normalizedPath.slice(version.prefix.length);
  }

  return normalizedPath.replace(/^\//, "");
}

export function buildVersionPath(pathWithinVersion, version, withBase) {
  const normalizedSuffix = String(pathWithinVersion || "").replace(/^\//, "");

  if (!version || version.prefix === "/") {
    return withBase(normalizedSuffix ? `/${normalizedSuffix}` : "/");
  }

  return withBase(
    normalizedSuffix ? `${version.prefix}${normalizedSuffix}` : version.prefix
  );
}

export const defaultDocsVersions = defineDocsVersions([
  {
    id: "v1",
    label: "v1",
    prefix: "/",
    snapshot: false,
    published: true,
    current: true,
  },
]);
