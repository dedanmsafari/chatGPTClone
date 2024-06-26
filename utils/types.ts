export enum Role {
  User = 0,
  Bot = 1,
}

export type Message = {
  role: Role;
  content: string;
  imageUrl?: string;
  prompt?: string;
};

export type Chat = {
  id: number;
  title: string;
};
