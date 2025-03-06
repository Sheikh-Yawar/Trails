export function getGradientColor(input: string): string {
  let hash = [...input].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Generate hues that stay within an aesthetically pleasing range
  const hue1 = Math.abs(hash % 360);
  const hue2 = Math.abs((hash * 1.3 + 90) % 360); // Offset for better contrast

  // Randomized angle for more variety
  const angle = Math.abs((hash * 1.5) % 360);

  // Refined saturation & lightness to resemble Microsoft’s soft, vibrant gradients
  return `linear-gradient(${angle}deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 85%, 70%))`;
}
