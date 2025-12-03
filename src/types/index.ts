export interface Coordinates {
    group: string;
    artifact: string;
}

export interface Artifact {
    id: string;
    name: string;
    category: string;
    version: string;
    coordinates: Coordinates;
    type: 'library' | 'plugin';
    bomRef?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Metadata {
    lastUpdated: string;
    kotlinVersion: string;
}

export interface MatrixData {
    metadata: Metadata;
    categories: Category[];
    artifacts: Artifact[];
}
