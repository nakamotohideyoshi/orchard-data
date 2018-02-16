import axios from 'axios';
import {
    SUBMISSIONS,
    SUBMISSION,
    SUBMISSIONS_REQUEST,
    SUBMISSIONS_FAILURE,
    SUBMISSIONS_ADD
} from '@/constants/types';
import {
    API_URL
} from '@/constants/config';

const state = {
    [`${SUBMISSIONS}`]: [],
    [`${SUBMISSION}`]: null,
    [`${SUBMISSIONS_REQUEST}`]: false,
    [`${SUBMISSIONS_FAILURE}`]: null,
}

const mutations = {
    [`${SUBMISSION}`](s, data) {
        return Object.assign(s, { [`${SUBMISSION}`]: data });
    },
    [`${SUBMISSIONS}`](s, items) {
        if(items instanceof Array && items.length) {
            return Object.assign(s, { [`${SUBMISSIONS}`]: items });
        }

        return Object.assign(s, { [`${SUBMISSIONS}`]: [] });
    },
    [`${SUBMISSIONS_REQUEST}`](s, status) {
        let finalStatus = false;

        if(status) {
            finalStatus = true;
        }

        return Object.assign(s, { [`${SUBMISSIONS_REQUEST}`]: finalStatus });
    },
    [`${SUBMISSIONS_FAILURE}`](s, error) {
        return Object.assign(s, { [`${SUBMISSIONS_FAILURE}`]: error });
    },
    [`${SUBMISSIONS_ADD}`](s, newSubmission) {
        return Object.assign(s, {
            [`${SUBMISSIONS}`]: s[SUBMISSIONS].concat(newSubmission)
        })
    }
}

const actions = {
    fetchSubmissions ({ commit }) {
        commit(SUBMISSIONS_REQUEST, true);

        axios
            .get(`${API_URL}dataset-meta-all`, {
                'headers': {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS, res.data);
            })
            .catch((e) => {
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS_FAILURE, e);
            });
    },
    submitDataset ({ commit }, data) {
        commit(SUBMISSIONS_REQUEST, true);
        commit(SUBMISSIONS_FAILURE, false); // RESET IN CASE OF A RE-TRY

        return axios
            .post(`${API_URL}dataset`, data, {
                // If this is a constant then we should configure axios
                // to always use it unless otherwise is especified
                'headers': {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                const item = res.data;

                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS_FAILURE, null);
                commit(SUBMISSION, item);
                commit(SUBMISSIONS_ADD, item);
            })
            .catch((e) => {
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS_FAILURE, e);
            });
    },
    fetchDataset ({ commit }, id) {
        commit(SUBMISSIONS_REQUEST, true);
        commit(SUBMISSIONS_FAILURE, null);
        commit(SUBMISSION, null);

        return axios
            .get(`${API_URL}dataset-meta/${id}`, {
                'headers': {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                commit(SUBMISSIONS_REQUEST, false);
                // Not sure about this, will this endpoint ever return more
                // than one result?
                commit(SUBMISSION, res.data[0]);
            })
            .catch((e) => {
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS_FAILURE, e);
            });
    }
}

const getters = {
    [`${SUBMISSION}`]: s => s[SUBMISSION],
    [`${SUBMISSIONS}`]: s => s[SUBMISSIONS],
    [`${SUBMISSIONS_REQUEST}`]: s => s[SUBMISSIONS_REQUEST],
    [`${SUBMISSIONS_FAILURE}`]: s => s[SUBMISSIONS_FAILURE],
};

export default {
    state,
    mutations,
    actions,
    getters
}
      