export interface ICreateUserRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  cpf: string;
  email: string;
}
