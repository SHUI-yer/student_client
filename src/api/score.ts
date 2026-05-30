import request from './request'
import type { Score, ScorePageParams, ApiResponse, PageResult, ScoreVO, Student, Course } from '../types'

export const getScorePage = (params: ScorePageParams): Promise<ApiResponse<PageResult<ScoreVO>>> => {
  return request.get('/api/score/page', { params })
}

export const saveScore = (data: Score): Promise<ApiResponse<string>> => {
  return request.post('/api/score/save', data)
}

export const deleteScore = (id: number): Promise<ApiResponse<string>> => {
  return request.delete(`/api/score/${id}`)
}

export const getAllStudents = (): Promise<ApiResponse<Student[]>> => {
  return request.get('/api/student/all')
}

export const getAllCourses = (): Promise<ApiResponse<Course[]>> => {
  return request.get('/api/course/all')
}
