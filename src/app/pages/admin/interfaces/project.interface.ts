import { ProjectCategory } from '../../../core/models/enums';

export interface Gallery {
  id: string;
  url: string;
  title?: string;
  description?: string;
  order: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  imageBefore?: string;
  imageAfter?: string;
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
  address: string;
  area: string;
  duration: string;
  date: string;
  clientId: string;
  challenge: string;
  solution: string;
  showOnHomepage: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  gallery?: Gallery[];
}

export interface CreateProjectDto {
  name: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  imageBefore?: string;
  imageAfter?: string;
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  area: string;
  duration: string;
  date: string;
  clientId: string;
  challenge: string;
  solution: string;
  showOnHomepage: boolean;
  gallery?: Gallery[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}
