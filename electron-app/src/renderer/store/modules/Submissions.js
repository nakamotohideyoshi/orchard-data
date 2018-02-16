import axios from 'axios';
import {
    SUBMISSIONS,
    SUBMISSIONS_REQUEST,
    SUBMISSIONS_FAILURE
} from '@/constants/types';
import {
    API_URL
} from '@/constants/config';

const state = {
    [`${SUBMISSIONS}`]: [],
    [`${SUBMISSIONS_REQUEST}`]: false,
    [`${SUBMISSIONS_FAILURE}`]: null,
}

const mutations = {
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
    }
}

const actions = {
    fetchSubmissions ({ commit }) {
        // do something async
        commit(SUBMISSIONS_REQUEST, true);

        axios
            .get(`${API_URL}dataset-meta-all`, {
                'headers': {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                console.log(res);
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS, res.data);
            })
            .catch((e) => {
                console.log(e, 'error');
                commit(SUBMISSIONS_REQUEST, false);
                commit(SUBMISSIONS_FAILURE, e);
            });
    }
}

const getters = {
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
      