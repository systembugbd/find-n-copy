console.clear();
const path = require("path");
// include the Node.js 'path' module at the top of your file
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "app/js/preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

     win.loadFile("app/components/index.html");
    //  win.webContents.openDevTools(false)

}
 
 

app.on("window-all-closed", function () {
  process.exit(1);
  if (process.platform !== "darwin") app.quit();
  
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

 