import {app} from '../../../app'

const API_URL = process.env.API_URL

export default {
  getReportGroups () {
    return app.$http.get(API_URL + 'transparency/reportgroup')
  },
  createReportGroup (data) {
    return app.$http.post(API_URL + 'transparency/reportgroup', data)
  },
  deleteReportGroup (id) {
    return app.$http.delete(API_URL + `transparency/reportgroup/${id}`)
  },
  updateReportGroup (id, data) {
    return app.$http.patch(API_URL + `transparency/reportgroup/${id}`, data)
  }
}
