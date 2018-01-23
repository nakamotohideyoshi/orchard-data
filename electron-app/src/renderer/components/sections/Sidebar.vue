<template>
	<section>
		<ol class="pagelist">
      <li>
        <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'submissions'}" @click="sidebarToggle('submissions')"><span>1.</span><em>submissions</em></a>
        <router-link :to="'/submissions'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
        <div class="pagelist__progress">
          <i style="width:100%"></i>
        </div>
      </li>
      <li>
	      <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'new-batch'}" @click="sidebarToggle('new-batch')"><span>2.</span><em>new-batch</em></a>
	      <router-link :to="'/new-batch'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
	      <div class="pagelist__progress">
	        <i style="width:100%"></i>
	      </div>
      </li>
      <li>
        <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'report'}" @click="sidebarToggle('report')"><span>3.</span><em>report</em></a>
        <router-link :to="'/report/:id'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
        <div class="pagelist__progress">
          <i style="width:100%"></i>
        </div>
      </li>
      <li>
        <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'report-progress'}" @click="sidebarToggle('report-progress')"><span>4.</span><em>report-progress</em></a>
        <router-link :to="'/report-progress'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
        <div class="pagelist__progress">
          <i style="width:100%"></i>
        </div>
      </li>
      <li>
	      <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'field-level'}" @click="sidebarToggle('field-level')"><span>5.</span><em>field-level</em></a>
	      <router-link :to="'/field-level'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
	      <div class="pagelist__progress">
	        <i style="width:100%"></i>
	      </div>
      </li>
      <li>
	      <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'row-scores'}" @click="sidebarToggle('row-scores')"><span>6.</span><em>row-scores</em></a>
	      <router-link :to="'/row-scores'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
	      <div class="pagelist__progress">
	        <i style="width:100%"></i>
	      </div>
      </li>
      <li>
	      <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'criteria-scores'}" @click="sidebarToggle('criteria-scores')"><span>7.</span><em>criteria-scores</em></a>
	      <router-link :to="'/criteria-scores'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
	      <div class="pagelist__progress">
	        <i style="width:100%"></i>
	      </div>
      </li>
      <li>
        <a class="pagelist__title" v-bind:class="{'is-active': currentPage == 'csv'}" @click="sidebarToggle('csv')"><span>8.</span><em>csv</em></a>
        <router-link :to="'/csv/:id'" class="pagelist__url">
          <svg class="icon icon-link"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use></svg>
        </router-link>
        <div class="pagelist__progress">
          <i style="width:75%"></i>
        </div>
      </li>
    </ol>
  </section>
</template>

<script>
import { eventHub } from '../../main.js'

export default {
  name: 'app-sidebar',
  components: {},
  data: function () {
    return {
      currentPage: 'submissions',
      eventHub: eventHub
    }
  },
  methods: {
    sidebarToggle (data) {
      this.currentPage = data
      eventHub.$emit('page-name', this.currentPage)
    }
  }
}
</script>

<style type="text/css">
	section{
    width: 300px;
    padding: 30px 0;
  }
  .pagelist{
    list-style-type: none;
    padding-top: 100px;
    width: 275px;
  }
  .pagelist li{
    margin-bottom: 25px;
  }
  .pagelist li:last-child{
  	margin-bottom: 0;
  }

  .pagelist__preview{
    display: inline-block;
    box-shadow: none;
    padding: 5px 20px;
    border: 1px solid #000;
    font-size: 13px;
    margin-top: 10px;
    text-transform: uppercase;
    text-shadow: none;
    font-size: 24px;
  }
  .pagelist__title{
    color: #000;
    text-decoration: none;
    padding: 5px 8px 5px 3px;
    position: relative;
  }
  .is-notready .pagelist__title{
    color: #aaaaaa;
    background: #fff;
    pointer-events: none;
  }
  .pagelist__title span{
    margin-right: 5px;
  }
  .pagelist__title em{
    font-style: normal;
    font-weight: normal;
    font-family: 'PoliticaBold',sans-serif;
    position: relative;
    display: inline-block;
  }
  .pagelist__title em:before{
    content: "";
    position: absolute;
    bottom: 4px;
    width: 100%;
    left: 0;
    border-top: 1px solid currentColor;
  }
  .pagelist__title.is-active{
    background: #000;
    color: #fff;
  }
  .pagelist__url{
    float: right;
    width: 24px;
    height: 24px;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin-left: 5px;
    margin-top: 4px;
  }
  .pagelist__url:hover .icon{
    fill: #555;
  }
  .is-notready .pagelist__url{
    pointer-events: none;
  }
  .pagelist__url .icon{
    fill: #333;
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    transition: all .2s ease;
  }
  .is-notready .pagelist__url .icon{
    fill:#aaaaaa;
  }
  .pagelist__progress{
    height: 4px;
    background: #eeeeee;
    margin-top: 5px;
  }
  .pagelist__progress i{
    height: 4px;
    display: block;
    background: #2ECC71;
  }
</style>