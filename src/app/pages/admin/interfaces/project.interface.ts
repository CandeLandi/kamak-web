import { ProjectCategory, ProjectStatus } from '../../../core/models/enums';

export interface Gallery {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export interface ProjectAddress {
  address: string;
  lat: number;
  lng: number;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  // client: string;
  description: string;
  longDescription: string;
  imageBefore?: string;
  imageAfter?: string;
  videoUrl?: string;
  address: ProjectAddress;
  area: string;
  duration: string;
  status: ProjectStatus;
  clientId: string;
  challenge: string;
  solution: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  gallery?: Gallery[];
}

export interface CreateProjectDto {
  name: string;
  category: ProjectCategory;
  // client: string;
  description: string;
  longDescription: string;
  imageBefore?: string;
  imageAfter?: string;
  videoUrl?: string;
  address: ProjectAddress;
  area: string;
  duration: string;
  status: ProjectStatus;
  clientId: string;
  challenge: string;
  solution: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateProjectDto {
  name?: string;
  category?: ProjectCategory;
  description?: string;
  longDescription?: string;
  imageBefore?: string;
  imageAfter?: string;
  videoUrl?: string;
  address?: ProjectAddress;
  area?: string;
  duration?: string;
  status?: ProjectStatus;
  challenge?: string;
  solution?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectVideo {
  id: string;
  url: string;
  order: number;
  description?: string;
  features?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationDto {
  page?: number | string;
  limit?: number | string;
  search?: string;
  category?: string;
}
