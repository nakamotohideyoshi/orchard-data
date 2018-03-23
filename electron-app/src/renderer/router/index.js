import Vue from 'vue'
import Router from 'vue-router'

// Components -> Pages
// import LandingPage from '../components/pages/LandingPage'
import SubmissionsPage from '../components/pages/SubmissionsPage'
import NewBatchPage from '../components/pages/NewBatchPage'
import ReportSummary from '../components/pages/ReportSummary'
import ReportHome from '../components/pages/ReportHome'
import ReportProgressPage from '../components/pages/ReportProgressPage'
import FieldByFieldReport from '../components/pages/FieldByFieldReport'
import RowByRowReport from '../components/pages/RowByRowReport'
import ErrorByErrorReport from '../components/pages/ErrorByErrorReport'
import CsvPage from '../components/pages/CsvPage'
import TSVPage from '../components/pages/TSVPage'
import ReportErrorPage from '../components/pages/ReportErrorPage'

// Enable router override on test environment
if (process.env.BABEL_ENV !== 'test') Vue.use(Router)

const router = new Router({
  routes: [
    {
      alias: '/',
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
      component: ReportSummary, // Better name this component
      // TODO: We may create a subdirectory for the subpages or put them
      // in the sections one, TBD
      children: [
        {
          path: '/',
          name: 'report',
          component: ReportHome
        },
        {
          path: 'params',
          name: 'report-params',
          component: ReportHome
        },
        {
          path: 'error-by-error',
          name: 'error-by-error',
          component: ErrorByErrorReport
        },
        {
          path: 'row-by-row',
          name: 'row-by-row',
          component: RowByRowReport
        },
        {
          path: 'field-by-field',
          name: 'field-by-field',
          component: FieldByFieldReport
        }
      ]
    },
    {
      path: '/report-progress',
      name: 'report-progress',
      component: ReportProgressPage
    },
    {
      path: '/report-error',
      name: 'report-error',
      component: ReportErrorPage
    },
    {
      path: '/csv/:id',
      name: 'csv',
      component: CsvPage
    },
    {
      path: '/tsv/:id/:highlightRowId?',
      name: 'tsv',
      component: TSVPage
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
