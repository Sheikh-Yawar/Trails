export function getGradientColor(input: string): string {
  let hash = [...input].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use golden ratio to get aesthetically pleasing hues
  const hue1 = Math.abs(hash % 360);
  const hue2 = Math.abs((hash * 1.6 + 120) % 360); // More spaced-out contrast

  // More vibrant Gen Z-style saturation & lightness
  const saturation1 = 85 + (hash % 10); // Between 85-95%
  const saturation2 = 75 + ((hash * 1.2) % 15); // Between 75-90%
  const lightness1 = 55 + (hash % 10); // Between 55-65%
  const lightness2 = 65 + ((hash * 1.3) % 10); // Between 65-75%

  // Dynamic angles for fresh aesthetics
  const angle = Math.abs((hash * 2.3) % 360);

  return `linear-gradient(${angle}deg, 
          hsl(${hue1}, ${saturation1}%, ${lightness1}%), 
          hsl(${hue2}, ${saturation2}%, ${lightness2}%))`;
}
