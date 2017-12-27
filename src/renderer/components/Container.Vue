<template>  
  <div class="app">
    <svg style="display:none" xmlns="http://www.w3.org/2000/svg">
      <symbol id="icon-desktop" viewbox="0 0 24 17">
        <title>
          Shape
        </title>
        <path d="M20 15c1.1 0 1.99-.9 1.99-2L22 2c0-1.1-.9-2-2-2H4C2.9 0 2 .9 2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 2h16v11H4V2zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill-rule="evenodd"></path>
      </symbol>
      <symbol id="icon-link" viewbox="0 0 24.684 24.684">
        <title>
          Shape
        </title>
        <path d="M2.166,3.406H0.418C0.188,3.406,0,3.594,0,3.826v20.438c0,0.232,0.188,0.42,0.418,0.42h20.439 c0.232,0,0.422-0.188,0.422-0.42v-1.75c0-0.23-0.189-0.418-0.422-0.418H2.586V3.826C2.586,3.594,2.398,3.406,2.166,3.406z"/>
        <path d="M3.406,0.416v20.441c0,0.234,0.188,0.418,0.42,0.418h20.441c0.229,0,0.416-0.184,0.416-0.418V0.416 C24.684,0.182,24.496,0,24.268,0H3.826C3.594,0,3.406,0.182,3.406,0.416z M18.818,6.705l-0.615,6.945 c-0.045,0.506-0.377,0.627-0.736,0.266l-1.662-1.662c-0.18-0.18-0.42-0.418-0.656-0.658l-3.547,3.549 c-0.361,0.361-0.947,0.361-1.307,0l-0.76-0.76c-0.357-0.357-0.357-0.943,0-1.307l3.549-3.545c-0.238-0.238-0.475-0.477-0.658-0.654 l-1.66-1.664c-0.359-0.363-0.24-0.691,0.266-0.736l6.947-0.613C18.482,5.818,18.861,6.195,18.818,6.705z"/>
      </symbol>
      <symbol id="icon-mobile" viewbox="0 0 13 22">
        <title>
          Shape
        </title>
        <path d="M10.5 0h-8A2.5 2.5 0 0 0 0 2.5v17A2.5 2.5 0 0 0 2.5 22h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 10.5 0zm-4 21c-.83 0-1.5-.67-1.5-1.5S5.67 18 6.5 18s1.5.67 1.5 1.5S7.33 21 6.5 21zm4.5-4H2V3h9v14z" fill-rule="evenodd"></path>
      </symbol>
      <symbol id="icon-tablet" viewbox="0 0 19 24">
        <title>
          Shape
        </title>
        <path d="M16.5 0h-14A2.5 2.5 0 0 0 0 2.5v19A2.5 2.5 0 0 0 2.5 24h14a2.5 2.5 0 0 0 2.5-2.5v-19A2.5 2.5 0 0 0 16.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5S8.67 20 9.5 20s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H2V3h15v16z" fill-rule="evenodd"></path>
      </symbol>
      <symbol id="icon-watch" viewbox="0 0 16 24">
        <title>
          Shape
        </title>
        <path d="M16 12c0-2.54-1.19-4.81-3.04-6.27L12 0H4l-.95 5.73A7.94 7.94 0 0 0 0 12a7.94 7.94 0 0 0 3.05 6.27L4 24h8l.96-5.73A7.976 7.976 0 0 0 16 12zM2 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z" fill-rule="evenodd"></path>
      </symbol>
      <symbol id="icon-wide" viewbox="0 0 22 20">
        <title>
          Shape
        </title>
        <path d="M20 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 12H2V2h18v10z" fill-rule="evenodd"></path>
      </symbol>
    </svg>
    
    <AppHead/>
    <div class="app-body">
        <AppSidebar/>
        <main class="main">
            <div class="container-fluid">
                <router-view></router-view>
            </div>
        </main>
        <AppAside page-name="submissions" />
    </div>
  </div>
</template>

<script>
  import AppHead from './sections/Head'
  import AppSidebar from './sections/Sidebar'
  import AppAside from './sections/Aside'

  export default {
    name: 'app',
    components: {
      AppHead,
      AppSidebar,
      AppAside
    }
  }
</script>

<style type="text/css">
  .app {
    padding: 0 40px;
  }
</style>