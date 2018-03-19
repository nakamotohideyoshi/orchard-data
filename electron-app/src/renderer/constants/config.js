import { ITUNES_CATEGORY, OVERALL_CATEGORY } from '@/constants/report-category'
// TODO: This needs to be updated depending on the APIs URL
export const API_URL = process.env.API_URL ? process.env.API_URL : 'http://localhost:3000/'
export const CATEGORIES = {
  [ITUNES_CATEGORY]: 'itunes',
  [OVERALL_CATEGORY]: 'risk'
}
