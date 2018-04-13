import { ITUNES_CATEGORY, OVERALL_CATEGORY } from '@/constants/report-category'
import { findAPortInUse } from 'portscanner'
import { URL } from 'url'

class ApiUrl {
  parsedApiUrl = new URL(process.env.API_URL ? process.env.API_URL : 'http://localhost:3000/')

  constructor () {
    const INITIAL_PORT = 3000
    const NUMBER_OF_TRIES = 100

    findAPortInUse(INITIAL_PORT, (INITIAL_PORT + NUMBER_OF_TRIES), this.parsedApiUrl.hostname).then((port) => {
      this.parsedApiUrl.port = port
    })
  }

  toString () {
    return this.parsedApiUrl.href
  }
}

export let API_URL = new ApiUrl()
export const CATEGORIES = {
  [ITUNES_CATEGORY]: 'itunes',
  [OVERALL_CATEGORY]: 'risk'
}
