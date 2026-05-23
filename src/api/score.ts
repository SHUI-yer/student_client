import request from './request'

export const getScorePage = (params: any) => {
  return request.get('/api/score/page', { params })
}

export const saveScore = (data: any) => {
  return request.post('/api/score/save', data)
}

export const deleteScore = (id: number) => {
  return request.delete(`/api/score/${id}`)
}

export const getAllStudents = () => {
  return request.get('/api/student/all')
}

export const getAllCourses = () => {
  return request.get('/api/course/all')
}
