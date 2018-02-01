import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Container from '../components/Container'

// Components -> Pages
// import LandingPage from '../components/pages/LandingPage'
import SubmissionsPage from '../components/pages/SubmissionsPage'
import NewBatchPage from '../components/pages/NewBatchPage'
import ReportPage from '../components/pages/ReportPage'
import ReportProgressPage from '../components/pages/ReportProgressPage'
import FieldLevelPage from '../components/pages/FieldLevelPage'
import RowScoresPage from '../components/pages/RowScoresPage'
import CriteriaScoresPage from '../components/pages/CriteriaScoresPage'
import CsvPage from '../components/pages/CsvPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: Container
    },
    {
      path: '/submissions',
      name: 'submissions-page',
      component: SubmissionsPage
    },
    {
      path: '/new-batch',
      name: 'new-batch-page',
      component: NewBatchPage
    },
    {
      path: '/report/:id',
      name: 'report',
      component: ReportPage,
      props: true
    },
    {
      path: '/report-progress',
      name: 'report-progress',
      component: ReportProgressPage
    },
    {
      path: '/field-level',
      name: 'field-level',
      component: FieldLevelPage
    },
    {
      path: '/row-scores',
      name: 'row-scores',
      component: RowScoresPage
    },
    {
      path: '/criteria-scores',
      name: 'criteria-scores',
      component: CriteriaScoresPage
    },
    {
      path: '/csv/:id',
      name: 'csv',
      component: CsvPage,
      props: true 
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
