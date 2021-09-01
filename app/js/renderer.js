const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
 const findncopybtn = document.querySelector('#findncopybtn')
 const imagetopdf = document.querySelector('#imagetopdf')
 const findfolderncopy = document.querySelector('#findfolderncopy')
 const htmltopdf = document.querySelector('#htmltopdf')

window.addEventListener('DOMContentLoaded', () => {
  findncopybtn.addEventListener('click', () => {
    let win = new  BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
          preload: path.join(__dirname, "../js/preload.js"),
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
      },
        
    })
    win.loadFile("app/components/findncopy.html");
  })


  findfolderncopy.addEventListener('click', () => {
    let win = new  BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
          preload: path.join(__dirname, "../js/preload.js"),
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
      },
        
    })
    win.loadFile("app/components/foldercopy.html");
  })



  imagetopdf.addEventListener('click', () => {
    let win = new  BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
          preload: path.join(__dirname, "../js/preload.js"),
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
      },
        
    })
    win.loadFile("app/components/imagetopdf.html");
  })


  
  htmltopdf.addEventListener('click', () => {
    let win = new  BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
          preload: path.join(__dirname, "../js/preload.js"),
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
      },
        
    })
    win.loadFile("app/components/htmltopdf.html");
  })





})



