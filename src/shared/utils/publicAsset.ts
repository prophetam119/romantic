/**
 * Путь к файлу из public/ — с учётом GitHub Pages (homepage) и кодированием имён.
 * content.ts: image: "/photos/брест 1 раз.jpg"
 */
export function publicAsset(assetPath: string): string {
  const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  const parts = assetPath.replace(/^\//, "").split("/");
  const encoded = parts.map((part) => encodeURIComponent(part)).join("/");
  return `${publicUrl}/${encoded}`;
}
