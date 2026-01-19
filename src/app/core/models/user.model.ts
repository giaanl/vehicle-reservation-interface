export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface UpdateProfilePatchRequest {
  name?: string;
  email?: string;
  password?: string;
}
