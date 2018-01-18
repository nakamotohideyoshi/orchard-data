<template>
  <header class="header">
    <h1>
      <span>Musical Turk</span>
    </h1>
    <div class="header__updated">
      <em>Musical Turk</em>
    </div>
    <nav class="types">
      <button data-mode="mobile" data-width="375" v-bind:class="{'is-active': currentLayout == 'mobile'}" @click="layoutToggle('mobile')">
        <svg class="icon icon-mobile"><use xlink:href="#icon-mobile"></use></svg>
        <strong>Mobile</strong>
        <span>375px</span>
      </button>
      <button data-mode="ipad" data-width="768" v-bind:class="{'is-active': currentLayout == 'tablet'}" @click="layoutToggle('tablet')">
        <svg class="icon icon-tablet"><use xlink:href="#icon-tablet"></use></svg>
        <strong>Tablet</strong>
        <span>768px</span></button>
      <button data-mode="desktop" data-width="1024" v-bind:class="{'is-active': currentLayout == 'desktop'}" @click="layoutToggle('desktop')">
        <svg class="icon icon-desktop"><use xlink:href="#icon-desktop"></use></svg>
        <strong>Desktop</strong>
        <span>1024px</span></button>
      <button data-mode="wide" data-width="1400" v-bind:class="{'is-active': currentLayout == 'desktop-hd'}" @click="layoutToggle('desktop-hd')">
        <svg class="icon icon-wide"><use xlink:href="#icon-wide"></use></svg>
        <strong>Desktop HD</strong>
        <span>1400px</span>
      </button>
    </nav>
  </header>
</template>

<script>
import { eventHub } from '../../main.js'
export default {
  name: 'app-head',
  components: {},
  data: function () {
    return {
      currentLayout: 'desktop-hd',
      eventHub: eventHub
    }
  },
  methods: {
    layoutToggle (data) {
      this.currentLayout = data
      eventHub.$emit('page-layout', this.currentLayout)
    }
  }
}
</script>

<style type="text/css">
  header{
    overflow: hidden;
    line-height: 1;
    height: 90px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: #fff;
  }
  header h1{
    background: #f9e900;
    background: var(--main-color);
    height: 91px;
    position: relative;
    width: 242px;
    display: inline-block;
    vertical-align: top;
  }
  header h1:before{
    width: 200px;
    height: 200px;
    position: absolute;
    right: 0;
    bottom: 0;
    content: "";
    background: #f9e900;
    background: var(--main-color);
    transform: rotate(38deg);
    transform-origin: 100% 100%;
  }
  header h1 span{
    display: block;
    position: absolute;
    z-index: 2;
    left: 42px;
    top: 22px;
  }
  header h1 .icon{
    font-size: 47px;
  }
  .header__updated{
    font-size: 24px;
    height: 90px;
    line-height: 90px;
    color: #050a0f;
    display: inline-block;
    vertical-align: top;
    margin-left: 80px;
  }
  .header__updated em{
    font-weight: normal;
    font-family: 'PoliticaBold',sans-serif;
    font-style: normal;
  }
  .types{
    position: absolute;
    right: 40px;
    top: 24px;
  }
  .types button,.types button:active{
    height: 46px;
    width: 112px;
    border: 1px solid #eee;
    background: #fff;
    font-size: 14px;
    color: #000;
    text-align: left;
    font-family: 'Politica', serif;
    padding-left: 38px;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: all .25s ease-in-out;
  }
  .types button:hover{
    background: #eee;
  }
  .types strong{
    font-weight: normal;
    font-family: 'PoliticaBold',sans-serif;
  }
  .types .icon{
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translate(0, -50%);
    font-size: 24px;
  }
  .types .icon-desktop{left: 5px;}
  .types .icon-wide{left: 8px;}

  .types button.is-active{
    border-color: #000;
    color: #fff;
    background: #000;
  }
  .types button.is-active .icon{
    color: #fff;
    fill: #fff;
  }
  .types span{
    display: block;
  }
  @media (max-width: 1200px){
    .header__updated{
      position: absolute;
      right: 42px;
      bottom: 0;
      line-height: 1;
      height: auto;
      margin: 0;
      font-size: 14px;
    }
  }
  @media (max-width: 780px){
    body{
      padding: 0;
    }
    .preview iframe,.types{
      display: none;
    }
    .preview{
      position: static;
      text-align: center;
    }
    header{
      position: relative;
      height: auto;
      text-align: center;
    }
    header h1{
      display: block;
      width: auto;
      height: auto;
      padding: 20px 0 30px;
    }
    header h1 span{
      position: static;
    }
    header .icon{
      font-size: 30px;
    }
    .header__updated{
      display: block;
      text-align: center;
      font-size: 14px;
      line-height: 1;
      text-align: center;
      padding: 0;
      height: auto;
      margin: 0;
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
    }
    section{
      margin: 0;
      width: auto;
      padding: 0;
    }
    .pagelist{
      margin: 0;
      padding: 20px;
      width: auto;
    }
  }
</style>
