import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Container from '../components/Container'

// Components -> Pages
// import LandingPage from '../components/pages/LandingPage'
import SubmissionsPage from '../components/pages/SubmissionsPage'
import NewBatchPage from '../components/pages/NewBatchPage'
import ReportSummary from '../components/pages/ReportSummary'
import ReportProgressPage from '../components/pages/ReportProgressPage'
import FieldByFieldReport from '../components/pages/FieldByFieldReport'
import RowByRowReport from '../components/pages/RowByRowReport'
import ErrorByErrorReport from '../components/pages/ErrorByErrorReport'
import CsvPage from '../components/pages/CsvPage'

// Enable router override on test environment
if (process.env.BABEL_ENV !== 'test') Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: Container
    },
    {
      path: '/submissions',
      name: 'SubmissionsPage',
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
      component: ReportSummary,
      props: true
    },
    {
      path: '/report-progress',
      name: 'report-progress',
      component: ReportProgressPage
    },
    {
      path: '/FieldByFieldReport/:id',
      name: 'FieldByFieldReport',
      component: FieldByFieldReport
    },
    {
      path: '/RowByRowReport/:id',
      name: 'RowByRowReport',
      component: RowByRowReport
    },
    {
      path: '/ErrorByErrorReport',
      name: 'ErrorByErrorReport',
      component: ErrorByErrorReport
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

// Just scroll to top for now, we can implement more comples
// behaviors depending on the next server view
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
