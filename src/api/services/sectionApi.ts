import { httpService } from './httpService';
import type {
  ICreateSectionRequest,
  ICreateSectionResponse,
  IGetAllSectionsResponse,
  IUpdateSectionRequest,
  ISectionUsersRequest,
} from '../interfaces/section';

export class SectionApi {
  async getAllSections(userId: number): Promise<IGetAllSectionsResponse[]> {
    return httpService.get(`/section?userId=${userId}`);
  }

  async createSection(requestBody: ICreateSectionRequest): Promise<ICreateSectionResponse> {
    return httpService.post('/section', requestBody);
  }

  async updateSection(id: number, requestBody: IUpdateSectionRequest): Promise<ICreateSectionResponse> {
    return httpService.put(`/section/${id}`, requestBody);
  }

  async deleteSection(id: number): Promise<void> {
    return httpService.delete(`/section/${id}`);
  }

  async updateSectionUsers(id: number, requestBody: ISectionUsersRequest): Promise<ICreateSectionResponse> {
    return httpService.put(`/section/${id}/users`, requestBody);
  }
}

export const sectionApi = new SectionApi();
