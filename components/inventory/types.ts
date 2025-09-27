export interface Plant {
  id: string;
  scientificName: string;
  commonName?: string;
  imageUrl?: string;
  confidence: number;
  dateAdded: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  family?: string;
  genus?: string;
  tags?: string[];
}

export interface InventoryStats {
  totalPlants: number;
  recentAdditions: number;
  topSpecies: { name: string; count: number }[];
}
