import axios from 'axios'
import {
  CONFIG_REQUEST,
  CONFIG_FAILURE,
  FILTERS_META,
  DATASET_COLUMNS
} from '@/constants/types'
import {
  API_URL
} from '@/constants/config'

const state = {
  [FILTERS_META]: null,
  [DATASET_COLUMNS]: null,
  [CONFIG_FAILURE]: null,
  [CONFIG_REQUEST]: false
}

const mutations = {
  [FILTERS_META] (s, filters) {
    if (filters instanceof Object) {
      return Object.assign(s, { [FILTERS_META]: filters })
    }

    return Object.assign(s, { [FILTERS_META]: null })
  },
  [DATASET_COLUMNS] (s, columns = {}) {
    return Object.assign(s, { [DATASET_COLUMNS]: columns })
  },
  [CONFIG_REQUEST] (s, status = false) {
    return Object.assign(s, { [CONFIG_REQUEST]: status })
  },
  [CONFIG_FAILURE] (s, error) {
    return Object.assign(s, { [CONFIG_FAILURE]: error })
  }
}

const actions = {
  getConfig ({ commit }) {
    commit(CONFIG_REQUEST, true)

    axios
      .get(`${API_URL}config`, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        commit(CONFIG_REQUEST, false)
        commit(FILTERS_META, res.data.meta)
        commit(DATASET_COLUMNS, res.data.datasetColumns)
      })
      .catch((e) => {
        commit(CONFIG_REQUEST, false)
        commit(CONFIG_FAILURE, e)
      })
  }
}

const getters = {
  [FILTERS_META]: s => s[FILTERS_META],
  [CONFIG_REQUEST]: s => s[CONFIG_REQUEST],
  [CONFIG_FAILURE]: s => s[CONFIG_FAILURE],
  [DATASET_COLUMNS]: s => s[DATASET_COLUMNS]
}

export default {
  state,
  mutations,
  actions,
  getters
}
