import request from '../utils/request'

export const login = (data) => request.post('/user/login', data)

export const getQuestions = () => request.get('/question')
export const addQuestion = (data) => request.post('/question', data)
export const updateQuestion = (data) => request.put('/question', data)
export const deleteQuestion = (id) => request.delete(`/question/${id}`)

export const createPaper = (studentId, questionCount) => 
  request.post('/exam/paper', null, { params: { studentId, questionCount } })

export const getPaperQuestions = (paperId) => 
  request.get(`/exam/paper/${paperId}/questions`)

export const submitPaper = (data) => request.post('/exam/submit', data)

export const getStudentPapers = (studentId) => 
  request.get(`/exam/student/${studentId}/papers`)

export const getScoreByPaperId = (paperId) => 
  request.get(`/exam/score/${paperId}`)

export const getStudentScores = (studentId) => 
  request.get(`/exam/student/${studentId}/scores`)

export const getStudentWrongQuestions = (studentId) => 
  request.get(`/exam/student/${studentId}/wrong-questions`)

export const getPaperDetail = (paperId) => 
  request.get(`/exam/paper/${paperId}/detail`)
