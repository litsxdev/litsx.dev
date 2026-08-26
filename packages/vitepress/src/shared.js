export { buildVersionPath, defineDocsVersions, getPathWithinVersion } from "./versions.js";

export function getVersionIdFromPath(pathname) {
  const [firstSegment] = String(pathname || "").replace(/^\//, "").split("/");
  return /^v\d+$/.test(firstSegment) ? firstSegment : null;
}

export function findVersionById(versions, versionId) {
  return versions.find((version) => version.id === versionId) ?? versions[0] ?? null;
}

export function findVersionByPath(versions, pathname) {
  const versionId = getVersionIdFromPath(pathname);
  if (versionId) {
    return findVersionById(versions, versionId);
  }

  return versions.find((version) => version.prefix === "/") ?? versions[0] ?? null;
}
