<template>
	<div>
		<aside class="preview" id="preview-wrapper" v-bind:style="{width: previewSize+'px'}">
			<div v-if="pageData == 'submissions'"><SubmissionsPage></SubmissionsPage></div>
			<div v-if="pageData == 'new-batch'"><new-batch-page></new-batch-page></div>
			<div v-if="pageData == 'report'"><ReportSummary></ReportSummary></div>
			<div v-if="pageData == 'report-progress'"><report-progress-page></report-progress-page></div>
			<div v-if="pageData == 'FieldByFieldReport'"><FieldByFieldReport></FieldByFieldReport></div>
			<div v-if="pageData == 'RowByRowReport'"><RowByRowReport></RowByRowReport></div>
			<div v-if="pageData == 'criteria-scores'"><ErrorByErrorReport></ErrorByErrorReport></div>
			<div v-if="pageData == 'csv'"><csv-page></csv-page></div>
		</aside>
	</div>
</template>

<script>
import SubmissionsPage from '../pages/SubmissionsPage'
import NewBatchPage from '../pages/NewBatchPage'
import ReportSummary from '../pages/ReportSummary'
import ReportProgressPage from '../pages/ReportProgressPage'
import FieldByFieldReport from '../pages/FieldByFieldReport'
import RowByRowReport from '../pages/RowByRowReport'
import ErrorByErrorReport from '../pages/ErrorByErrorReport'
import CsvPage from '../pages/CsvPage'
import { eventHub } from '../../main.js'

export default {
  name: 'app-aside',
  components: {
    SubmissionsPage,
    NewBatchPage,
    ReportSummary,
    ReportProgressPage,
    FieldByFieldReport,
    RowByRowReport,
    ErrorByErrorReport,
    CsvPage
  },
  props: ['page-name'],
  data: function () {
    return {
      pageData: this.pageName,
      previewSize: ''
    }
  },
  methods: {
  },
  created: function () {
    eventHub.$on('page-name', data => {
      this.pageData = data
    })
    eventHub.$on('page-layout', data => {
      let windowWidth = window.innerWidth
      let sidebarWidth = 380
      let maxPreviewSize = windowWidth - sidebarWidth

      switch (data) {
        case 'mobile':
          this.previewSize = 375
          break
        case 'tablet':
          this.previewSize = 768
          break
        case 'desktop':
          this.previewSize = 1024
          break
        case 'desktop-hd':
          this.previewSize = 1400
          break
        default:
          this.previewSize = 1400
      }

      if (this.previewSize > maxPreviewSize) {
        this.previewSize = maxPreviewSize
      }
    })
  }
}
</script>

<style type="text/css">
	.preview{
	  position: fixed;
	  right: 42px;
	  top: 120px;
	  left: 355px;
	  bottom: 40px;
		opacity: 1;
		margin: 0 auto;
		transform-origin: 0 0;
		box-shadow: 0 0 20px rgba(0,0,0,.6);
		overflow: auto;
	}
</style>
