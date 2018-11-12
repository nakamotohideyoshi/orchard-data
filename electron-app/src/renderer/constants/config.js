import { ITUNES_CATEGORY, OVERALL_CATEGORY } from '@/constants/report-category'
import { findAPortInUse } from 'portscanner'
import { URL } from 'url'
import axios from 'axios'

class ApiUrl {
  INITIAL_PORT = 3000
  NUMBER_OF_TRIES = 100

  parsedApiUrl = new URL(process.env.API_URL ? process.env.API_URL : 'http://localhost:3000/')

  /**
   * Looks for the server in a specific port range.
   * @param {number} initialPort
   * @param {number} finalPort
   */
  findMusicalTurkServerInPortRange (initialPort, finalPort) {
    findAPortInUse(initialPort, finalPort, this.parsedApiUrl.hostname).then((port) => {
      this.parsedApiUrl.port = port
      axios.get(`${this.parsedApiUrl.href}is-musical-turk`).then((response) => {
        if (!response.data || response.data !== 'is-musical-turk') {
          this.findMusicalTurkServerInPortRange(port + 1, finalPort)
        }
      }).catch(() => {
        this.findMusicalTurkServerInPortRange(port + 1, finalPort)
      })
    })
  }

  /**
   * Returns the current API URL. Also, on every request, checks if the API is still up and running.
   * If it's not, looks for the server in a specific port range.
   * @returns {string}
   */
  toString () {
    axios.get(`${this.parsedApiUrl.href}is-musical-turk`).then((response) => {
      if (!response.data || response.data !== 'is-musical-turk') {
        this.findMusicalTurkServerInPortRange(this.INITIAL_PORT, (this.INITIAL_PORT + this.NUMBER_OF_TRIES))
      }
    }).catch(() => {
      this.findMusicalTurkServerInPortRange(this.INITIAL_PORT, (this.INITIAL_PORT + this.NUMBER_OF_TRIES))
    })

    return this.parsedApiUrl.href
  }
}

export let API_URL = new ApiUrl()
export const CATEGORIES = {
  [ITUNES_CATEGORY]: 'itunes',
  [OVERALL_CATEGORY]: 'risk'
}
