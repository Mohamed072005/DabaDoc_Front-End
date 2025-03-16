import {User} from './user.model';

export interface Question {
  id: string;
  title: string;
  content: string;
  location: number[];
  created_at: string;
  updated_at: string;
  user: User;
  answers: any[]
  likes: [
    {
      id: string;
      user_id: string;
    }
  ] | []
}
