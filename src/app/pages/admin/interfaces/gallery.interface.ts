export interface Gallery {
  id: string;
  url: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryDto {
  url: string;
  order?: number;
}

export interface UpdateGalleryDto {
  url?: string;
  order?: number;
}
