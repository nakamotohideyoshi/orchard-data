import axios from 'axios'
import {
  SUBMISSIONS,
  SUBMISSION,
  SUBMISSION_ERRORS,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  SUBMISSIONS_ADD,
  SUBMISSIONS_LOADED,
  SUBMISSION_TSV,
  FIELDS,
  FIELDS_FAILURE,
  FIELDS_REQUEST,
  SUBMISSION_DELETED
} from '@/constants/types'
import {
  API_URL
} from '@/constants/config'

const state = {
  [SUBMISSIONS]: [],
  [SUBMISSION_TSV]: null,
  [SUBMISSION]: null,
  [SUBMISSION_ERRORS]: [],
  [SUBMISSIONS_REQUEST]: false,
  [SUBMISSIONS_FAILURE]: null,
  [SUBMISSIONS_LOADED]: false,
  [FIELDS]: null,
  [FIELDS_REQUEST]: false,
  [FIELDS_FAILURE]: null
}

const mutations = {
  [SUBMISSION] (s, data) {
    return Object.assign(s, { [SUBMISSION]: data })
  },
  [SUBMISSION_DELETED] (s, id) {
    let subs = new Set(s[SUBMISSIONS])
    const matchingSub = s[SUBMISSIONS].find(sub => sub.rowid === id)
    subs.delete(matchingSub)

    s[SUBMISSIONS] = Array.from(subs)
  },
  [SUBMISSION_ERRORS] (s, data = []) {
    return Object.assign(s, { [SUBMISSION_ERRORS]: data })
  },
  [SUBMISSIONS] (s, items) {
    if (items instanceof Array && items.length) {
      return Object.assign(s, { [SUBMISSIONS]: items })
    }

    return Object.assign(s, { [SUBMISSIONS]: [] })
  },
  [SUBMISSIONS_REQUEST] (s, status) {
    let finalStatus = false

    if (status) {
      finalStatus = true
    }

    return Object.assign(s, { [SUBMISSIONS_REQUEST]: finalStatus })
  },
  [SUBMISSIONS_FAILURE] (s, error) {
    return Object.assign(s, { [SUBMISSIONS_FAILURE]: error })
  },
  [SUBMISSIONS_LOADED] (s, status) {
    return Object.assign(s, { [SUBMISSIONS_LOADED]: status })
  },
  [SUBMISSIONS_ADD] (s, newSubmission) {
    return Object.assign(s, {
      [SUBMISSIONS]: s[SUBMISSIONS].concat(newSubmission)
    })
  },
  [SUBMISSION_TSV] (s, tsv) {
    return Object.assign(s, { [SUBMISSION_TSV]: tsv })
  },
  [FIELDS] (s, item) {
    if (item instanceof Object) {
      return Object.assign(s, { [FIELDS]: item })
    }

    return Object.assign(s, { [FIELDS]: {} })
  },
  [FIELDS_REQUEST] (s, status) {
    let finalStatus = false

    if (status) {
      finalStatus = true
    }

    return Object.assign(s, { [FIELDS_REQUEST]: finalStatus })
  },
  [FIELDS_FAILURE] (s, error) {
    return Object.assign(s, { [FIELDS_FAILURE]: error })
  }
}

const actions = {
  deleteSubmission ({ commit }, id) {
    commit(SUBMISSIONS_REQUEST, true)

    return axios
      .delete(`${API_URL}dataset-meta/${id}`)
      .then(() => {
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSION_DELETED, id)
      })
  },

  fetchSubmissions ({ commit }) {
    commit(SUBMISSIONS_REQUEST, true)

    axios
      .get(`${API_URL}dataset-meta-all`, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        commit(SUBMISSIONS, res.data)
      })
      .catch((e) => {
        commit(SUBMISSIONS_FAILURE, e)
      })
      .finally(() => {
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSIONS_LOADED, true)
      })
  },
  submitDataset ({ commit }, data) {
    commit(SUBMISSIONS_REQUEST, true)
    commit(SUBMISSIONS_FAILURE, false) // RESET IN CASE OF A RE-TRY

    return axios
      .post(`${API_URL}dataset`, data, {
        // If this is a constant then we should configure axios
        // to always use it unless otherwise is especified
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        const item = { ...data, status: 1, rowid: res.data.datasetId }
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSIONS_FAILURE, null)
        commit(SUBMISSION, item)
        commit(SUBMISSIONS_ADD, item)
      })
      .catch((e) => {
        const item = { ...data, status: 2, rowid: e.response.data.datasetId }
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSIONS_FAILURE, e)
        commit(SUBMISSION, item)
        commit(SUBMISSIONS_ADD, item)
      })
  },
  fetchDataset ({ commit }, id) {
    commit(SUBMISSIONS_REQUEST, true)
    commit(SUBMISSIONS_FAILURE, null)
    commit(SUBMISSION, null)

    return axios
      .get(`${API_URL}dataset-meta/${id}`, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        commit(SUBMISSIONS_REQUEST, false)
        // Not sure about this, will this endpoint ever return more
        // than one result?
        commit(SUBMISSION, res.data[0])
      })
      .catch((e) => {
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSIONS_FAILURE, e)
      })
  },
  fetchTSV ({ commit }, id) {
    commit(SUBMISSIONS_REQUEST, true)
    commit(SUBMISSIONS_FAILURE, null)
    commit(SUBMISSION_TSV, null)

    console.log(id, 'id')

    return axios
      .get(`${API_URL}dataset/${id}.tsv`)
      .then((res) => {
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSION_TSV, res.data)
      })
      .catch((e) => {
        commit(SUBMISSIONS_REQUEST, false)
        commit(SUBMISSIONS_FAILURE, e)
      })
  },
  fetchFields ({ commit }, id) {
    commit(FIELDS_REQUEST, true)
    commit(FIELDS_FAILURE, null)
    commit(FIELDS, null)

    return axios
      .get(`${API_URL}field-by-field/${id}`, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        // TODO: Fix API response to show actual error
        if (res.data[0]) {
          commit(FIELDS, res.data)
        } else {
          throw new Error('Fields not found')
        }
      })
      .catch((e) => {
        commit(FIELDS_FAILURE, e)
      })
      .finally(() => {
        commit(FIELDS_REQUEST, false)
      })
  },
  fetchErrors ({ commit }, id) {
    commit(SUBMISSIONS_REQUEST, true)

    axios
      .get(`${API_URL}error-by-error/${id}`, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        commit(SUBMISSION_ERRORS, res.data)
      })
      .catch((e) => {
        commit(SUBMISSIONS_FAILURE, e)
      })
      .finally(() => {
        commit(SUBMISSIONS_REQUEST, false)
      })
  }
}

const getters = {
  [SUBMISSION]: s => s[SUBMISSION],
  [SUBMISSION_TSV]: s => s[SUBMISSION_TSV],
  [SUBMISSION_ERRORS]: s => s[SUBMISSION_ERRORS],
  [SUBMISSIONS]: s => s[SUBMISSIONS],
  [SUBMISSIONS_REQUEST]: s => s[SUBMISSIONS_REQUEST],
  [SUBMISSIONS_FAILURE]: s => s[SUBMISSIONS_FAILURE],
  [SUBMISSIONS_LOADED]: s => s[SUBMISSIONS_LOADED],
  [FIELDS]: s => s[FIELDS],
  [FIELDS_REQUEST]: s => s[FIELDS_REQUEST],
  [FIELDS_FAILURE]: s => s[FIELDS_FAILURE]
}

export default {
  state,
  mutations,
  actions,
  getters
}
