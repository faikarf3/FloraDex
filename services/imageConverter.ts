import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

/**
 * Convert any image format to JPEG for PlantNet API compatibility
 */
export async function convertToJpeg(imageUri: string): Promise<string> {
  try {
    const result = await manipulateAsync(
      imageUri,
      [], // No transformations needed, just format conversion
      {
        compress: 0.8,
        format: SaveFormat.JPEG,
      }
    );
    
    return result.uri;
  } catch (error) {
    console.error('Image conversion failed:', error);
    throw new Error(`Failed to convert image to JPEG: ${error}`);
  }
}

/**
 * Ensure image is in a format supported by PlantNet (JPEG or PNG)
 */
export async function ensurePlantNetCompatibleFormat(imageUri: string): Promise<string> {
  try {
    // Always convert to JPEG to ensure compatibility
    // This handles all formats including SVG, HEIC, etc.
    const jpegUri = await convertToJpeg(imageUri);
    
    return jpegUri;
  } catch (error) {
    console.error('Image format conversion failed:', error);
    throw new Error(`Failed to convert image to PlantNet compatible format: ${error}`);
  }
}

/**
 * Optimize image for PlantNet API
 * Reduces file size while maintaining quality
 */
export async function optimizeImageForPlantNet(imageUri: string): Promise<string> {
  try {
    const result = await manipulateAsync(
      imageUri,
      [
        // Resize if too large (max 2048px on longest side)
        { resize: { width: 2048 } }
      ],
      {
        compress: 0.7, // Good balance of quality and file size
        format: SaveFormat.JPEG,
      }
    );
    
    return result.uri;
  } catch (error) {
    console.error('Image optimization failed:', error);
    return imageUri;
  }
}
