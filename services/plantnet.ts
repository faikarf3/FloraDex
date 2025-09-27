// Direct PlantNet API integration without Firebase Storage
import { ensurePlantNetCompatibleFormat, optimizeImageForPlantNet } from './imageConverter';

export interface PlantNetResult {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship?: string;
    scientificName: string;
    genus: {
      scientificNameWithoutAuthor: string;
      scientificName: string;
    };
    family: {
      scientificNameWithoutAuthor: string;
      scientificName: string;
    };
    commonNames?: string[];
  };
  images?: Array<{
    organ: string;
    author: string;
    license: string;
    url: {
      o: string;
      m: string;
      s: string;
    };
  }>;
}

export interface PlantNetResponse {
  query: {
    project: string;
    images: string[];
    organs: string[];
  };
  results: PlantNetResult[];
  bestMatch?: string;
  version: string;
  remainingIdentificationRequests: number;
}

export interface IdentificationResult {
  label: string;
  score: number;
  scientificName: string;
  commonNames?: string[];
  family?: string;
  genus?: string;
}

/**
 * Convert image URI to blob for direct upload to PlantNet
 */
async function uriToBlob(uri: string): Promise<Blob> {
  try {
    // Handle different URI types
    let fetchUri = uri;
    if (uri.startsWith('file://')) {
      // For local files, we need to read them differently
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch local file: ${response.status}`);
      }
      return await response.blob();
    }
    
    const response = await fetch(fetchUri);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('URI to blob conversion failed:', error);
    throw new Error(`Failed to convert image to blob: ${error}`);
  }
}

/**
 * Identify plant using direct PlantNet API call
 */
export async function identifyPlant(
  imageUri: string, 
  organ: string = "leaf",
  apiKey: string
): Promise<IdentificationResult[]> {
  try {
    // Ensure image is in PlantNet-compatible format (JPEG/PNG)
    const compatibleImageUri = await ensurePlantNetCompatibleFormat(imageUri);
    
    // Optimize image for better API performance
    const optimizedImageUri = await optimizeImageForPlantNet(compatibleImageUri);
    
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Create a proper file object for React Native
    const file = {
      uri: optimizedImageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    };
    
    formData.append('images', file as any);
    formData.append('organs', organ);
    
    // Make request to PlantNet API
    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}&lang=en&include-related-images=false&no-reject=false`,
      {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let fetch set it automatically for FormData
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PlantNet API error ${response.status}: ${errorText}`);
    }

    const data: PlantNetResponse = await response.json();
    
    // Transform results to our format
    return data.results.map((result): IdentificationResult => ({
      label: result.species.scientificNameWithoutAuthor,
      score: result.score,
      scientificName: result.species.scientificName,
      commonNames: result.species.commonNames,
      family: result.species.family?.scientificName,
      genus: result.species.genus?.scientificName,
    }));

  } catch (error: any) {
    console.error('PlantNet identification error:', error);
    throw new Error(`Plant identification failed: ${error.message}`);
  }
}

/**
 * Get remaining API requests for the day
 */
export async function getRemainingRequests(apiKey: string): Promise<number> {
  try {
    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
      { method: 'HEAD' }
    );
    
    const remaining = response.headers.get('X-Remaining-Requests');
    return remaining ? parseInt(remaining) : 0;
  } catch {
    return 0;
  }
}
