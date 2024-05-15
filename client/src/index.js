const { app, BrowserWindow } = require("electron")
const { join } = require("node:path")

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

    win.loadURL(join(process.cwd() , 'web' , 'index.html'))
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