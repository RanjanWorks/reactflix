import ColorThief from "colorthief";

export const getDominantColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        // Optionally, use getPalette for more context-specific results
        const palette = colorThief.getPalette(img, 5); // Top 5 colors
        const dominantColor = palette[0]; // Choose the most dominant color
        resolve(dominantColor);
      } catch (error) {
        reject("Failed to extract dominant color");
      }
    };

    img.onerror = () => reject("Image failed to load");
  });
};
