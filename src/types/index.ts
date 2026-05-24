export interface Student {
  id?: number;
  name: string;
  studentNumber: string;
  gender: string;
  age: number;
  major: string;
  className: string;
  avatarUrl?: string;
}

export interface Course {
  id?: number;
  courseNumber: string;
  name: string;
  credit: number;
  teacher: string;
  semester: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}
