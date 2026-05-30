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

export interface Score {
  id?: number;
  studentId?: number;
  courseId?: number;
  score?: number;
  originalScore: number;
}

export interface ScoreVO {
  id: number;
  studentName: string;
  studentNumber: string;
  major: string;
  courseName: string;
  courseNumber: string;
  credit: number;
  score: number;
  originalScore: number;
  studentId: number;
  courseId: number;
}

export interface ScorePageParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
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
