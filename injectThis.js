// Inject at the bottom of index.js & ssb-interop.js
// /Applications/Slack.app/Contents/Resources/app.asar.unpacked/src/static/index.js
// /Applications/Slack.app/Contents/Resources/app.asar.unpacked/src/static/ssb-interop.js

// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

   // Then get its webviews
   let webviews = document.querySelectorAll(".TeamView webview");

   // Fetch our CSS in parallel ahead of time
   const cssPath = 'https://raw.githubusercontent.com/MaxvandeLaar/slack-theme-dracula/master/dracula.css?date='+Date.now();
   let cssPromise = fetch(cssPath).then(response => response.text()).catch(err => {
       console.error(err);
   });

// //
//
//       let css = `
//       :root {
//    /* Modify these to change your theme colors: */
//    --primary: #09F;
//    --text: #DDD;
//    --background: #111;
//    --background-elevated: #222;
//
//    /* These should be less important: */
//    --background-hover: rgba(255, 255, 255, 0.1);
//    --background-light: #AAA;
//    --background-bright: #FFF;
//
//    --border-dim: #666;
//    --border-bright: var(--primary);
//
//    --text-bright: #FFF;
//    --text-special: var(--primary);
//
//    --scrollbar-background: #000;
//    --scrollbar-border: var(--primary);
// }
//
//          .p-message_pane .c-message_list.c-virtual_list--scrollbar>.c-scrollbar__hider, .p-message_pane .c-message_list:not(.c-virtual_list--scrollbar){
//              background-color: #252525 !important;
//          }
//       `;
//
   // Insert a style tag into the wrapper view
   cssPromise.then(css => {
      let s = document.createElement('style');
      s.type = 'text/css';
      s.innerHTML = css;
      s.id = "slack-custom-css";
      // s.innerHTML = customCustomCSS;
      document.head.appendChild(s);
   });
   // Wait for each webview to load
   webviews.forEach(webview => {
      webview.addEventListener('ipc-message', message => {
         if (message.channel == 'didFinishLoading') {
            // Finally add the CSS into the webview
            cssPromise.then(css => {
               let script = `
                     let s = document.createElement('style');
                     s.type = 'text/css';
                     s.id = 'slack-custom-css';
                     s.innerHTML = \`${css}\`;
                     document.head.appendChild(s);
                     `;
               webview.executeJavaScript(script);
            })
        }
      });
   });
});
