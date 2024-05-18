const { app, BrowserWindow, ipcMain } = require("electron")
const { join } = require("node:path")

let url = "";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.maximize();

    win.webContents.openDevTools();

    win.loadFile(join('src' ,'web' , 'index.html'))


    // Listen to ipcMain Events

    ipcMain.on("url_init_host" , (event, url) => {
        url = url;
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})