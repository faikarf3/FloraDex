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
  imageUrl?: string;
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
    console.log('[identifyPlant] Starting identification');
    // Ensure image is in PlantNet-compatible format (JPEG/PNG)
    const compatibleImageUri = await ensurePlantNetCompatibleFormat(imageUri);
    console.log('[identifyPlant] Compatible URI:', compatibleImageUri);
    
    // Optimize image for better API performance
    const optimizedImageUri = await optimizeImageForPlantNet(compatibleImageUri);
    console.log('[identifyPlant] Optimized URI:', optimizedImageUri);
    
    // Create FormData for multipart upload
    const formData = new FormData();

    // Convert to blob for reliable uploads across platforms
    const imageBlob = await uriToBlob(optimizedImageUri);
    console.log('[identifyPlant] Blob created:', imageBlob.size, 'bytes');

    formData.append('images', imageBlob, 'plant.jpg');
    formData.append('organs', organ);
    console.log('[identifyPlant] FormData prepared');
    
    const plantNetUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}&lang=en&include-related-images=false&no-reject=false`;
    const defaultLocalProxy =
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000/plantnet'
        : undefined;
    const proxyTemplate =
      process.env.EXPO_PUBLIC_PLANTNET_PROXY_URL?.trim() ||
      process.env.EXPO_PUBLIC_PLANTNET_ENDPOINT?.trim() ||
      defaultLocalProxy;

    const requestUrl = (() => {
      if (!proxyTemplate) {
        console.warn(
          '[identifyPlant] No proxy endpoint configured. Web requests will hit PlantNet directly and may fail with CORS.'
        );
        return plantNetUrl;
      }

      if (proxyTemplate.includes('{url}')) {
        return proxyTemplate.replace('{url}', encodeURIComponent(plantNetUrl));
      }

      if (proxyTemplate.endsWith('=') || proxyTemplate.endsWith('/')) {
        return `${proxyTemplate}${encodeURIComponent(plantNetUrl)}`;
      }

      if (proxyTemplate.includes('?')) {
        const separator = proxyTemplate.endsWith('?') ? '' : '&target=';
        return `${proxyTemplate}${separator}${encodeURIComponent(plantNetUrl)}`;
      }

      return `${proxyTemplate}?target=${encodeURIComponent(plantNetUrl)}`;
    })();

    const response = await fetch(requestUrl, {
      method: 'POST',
      body: formData,
    });
    console.log('[identifyPlant] Request URL:', requestUrl);

    console.log('[identifyPlant] Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[identifyPlant] Error body:', errorText);

      if (response.status === 403 && errorText.includes('Origin not allowed')) {
        throw new Error(
          'PlantNet rejected the request from this origin. Configure EXPO_PUBLIC_PLANTNET_PROXY_URL to point to a server-side proxy.'
        );
      }

      throw new Error(`PlantNet API error ${response.status}: ${errorText}`);
    }

    const data: PlantNetResponse = await response.json();
    console.log('[identifyPlant] Parsed results count:', data.results.length);

    // Transform results to our format
    const transformed = data.results.map((result): IdentificationResult => {
      const representativeImage = result.images?.[0]?.url?.m ??
        result.images?.[0]?.url?.s ??
        result.images?.[0]?.url?.o;

      return {
        label: result.species.scientificNameWithoutAuthor,
        score: result.score,
        scientificName: result.species.scientificName,
        commonNames: result.species.commonNames,
        family: result.species.family?.scientificName,
        genus: result.species.genus?.scientificName,
        imageUrl: representativeImage,
      };
    });
    console.log('[identifyPlant] Transformed results count:', transformed.length);
    return transformed;
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
