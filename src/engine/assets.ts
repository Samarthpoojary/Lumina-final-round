export function createImageAsset(source: string): HTMLImageElement {
  const image = new Image();
  image.src = source;
  return image;
}
