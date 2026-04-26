export interface ICreateSectionRequest {
  name: string;
  description: string;
  expiration: number;
  userId: number;
}

export interface ICreateSectionResponse {
  id: number;
  name: string;
  description: string;
  expiration: number;
  startAt: string;
  ownerId: number | null;
}

export interface IGetAllSectionsResponse {
  id: number;
  name: string;
  description: string;
  expiration: number;
  startAt: string;
  totalVotes: number;
  votesTrue: number;
  votesFalse: number;
  hasVoted: boolean;
  isExpired: boolean;
  ownerId: number | null;
  allowedUsers: number[];
}

export interface IUpdateSectionRequest {
  name?: string;
  description?: string;
  expiration?: number;
}

export interface ISectionUsersRequest {
  userIds: number[];
}
