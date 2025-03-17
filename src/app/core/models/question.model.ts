import {User} from './user.model';

export interface Answer {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: User;
}

export interface Like {
  id: string;
  user_id: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
  user: User;
  answers: Answer[];
  likes: Like[];
}

export interface QuestionFormData {
  title: string;
  content: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}
