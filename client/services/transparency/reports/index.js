import {app} from '../../../app'

const API_URL = process.env.API_URL

export default {
  getReports () {
    return app.$http.get(API_URL + 'transparency/report')
  },
  createReport (data) {
    return app.$http.post(API_URL + 'transparency/report', data)
  },
  deleteReport (id) {
    return app.$http.delete(API_URL + `transparency/report/${id}`)
  },
  updateReport (id, data) {
    return app.$http.patch(API_URL + `transparency/report/${id}`, data)
  }
}
