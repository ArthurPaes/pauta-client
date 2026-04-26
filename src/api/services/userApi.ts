import { httpService } from './httpService';
import type { ICreateUserRequest, IUserResponse } from '../interfaces/user';
import type { IResponseLogin } from '../interfaces/auth';

export class UserApi {
  async createUser(requestBody: ICreateUserRequest): Promise<IResponseLogin> {
    return httpService.post('/user', requestBody);
  }

  async getAllUsers(excludeId: number): Promise<IUserResponse[]> {
    return httpService.get(`/user?excludeId=${excludeId}`);
  }
}

export const userApi = new UserApi();
