const {
  ipcMain,
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  dialog,
} = require("electron");
const path = require("path");
const fs = require("fs");
const prompt = require("electron-prompt");

const { getdbPath } = require("./db/dbmgr");

const installationPassword = "tallyZMadeAccountingEasy";

const flagFilePath = path.join(app.getPath("userData"), "installedtallyZ.flag");

function isNewInstallation() {
  try {
    // Check if the file exists
    fs.accessSync(flagFilePath, fs.constants.F_OK);
    console.log("reading file path");
    return false; // The flag file exists, indicating it's not a new installation
  } catch (err) {
    console.error("Error reading flag file:", err);
    return true; // The flag file doesn't exist, indicating a new installation
  }
}

async function promptForInstallationPassword() {
  const result = await prompt({
    title: "Installation Password",
    label: "Please enter the installation password:",
    inputAttrs: {
      type: "password",
    },
    type: "input",
    alwaysOnTop: true,
    skipTaskbar: true,
    // customStylesheet: path.join(__dirname, 'path-to-your-stylesheet.css') // Optional: Apply custom styling
  });

  return result;
}

let mainWindow;

app.on("ready", () => {
  const splashWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  splashWindow.loadFile("splash.html");

  if (isNewInstallation()) {
    // It's a new installation, prompt for password
    console.log("Prompting for password...");
    promptForInstallationPassword().then((enteredPassword) => {
      if (enteredPassword === installationPassword) {
        mainWindow = new BrowserWindow({
          width: 1100,
          height: 600,
          webPreferences: {
            frame: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(app.getAppPath(), "preload.js"),
          },
        });

        mainWindow.loadFile("dashboard.html");
        mainWindow.once("ready-to-show", () => {
          setTimeout(() => {
            splashWindow.destroy();
            mainWindow.show();
            mainWindow.setFullScreen(true);
          }, 3000); // Adjust the delay (in milliseconds) as needed
        });
        // Open in full screen
        // mainWindow.setFullScreen(true);
        fs.writeFileSync(flagFilePath, "installed");
      } else {
        // Incorrect password, inform the user
        dialog.showErrorBox(
          "Invalid Password",
          "The installation password is incorrect. Please try again."
        );
        app.quit();
      }
    });
  } else {
    // Existing installation, proceed as usual
    mainWindow = new BrowserWindow({
      width: 1100,
      height: 600,
      webPreferences: {
        frame: false,

        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(app.getAppPath(), "preload.js"),
      },
    });

    ipcMain.on("app-quit", () => {
      app.quit();
    });

    // Open in full screen
    // mainWindow.setFullScreen(true);
    mainWindow.loadFile("dashboard.html");
    mainWindow.once("ready-to-show", () => {
      setTimeout(() => {
        splashWindow.destroy();
        mainWindow.show();
        mainWindow.setFullScreen(true);
      }, 3000); // Adjust the delay (in milliseconds) as needed
    });
  }
});

//the data restore function is not needed as the file name
// is "database" and any backup file can be renamed and
// replaced with the database file in the data folder

ipcMain.on("chooseDatabaseFile", async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      title: "Select Database File",
      filters: [{ name: "SQLite Databases", extensions: ["db"] }],
      properties: ["openFile"],
    });

    const selectedFilePath = result.filePaths[0] || null;
    event.reply("chosenDatabaseFile", selectedFilePath);
  } catch (error) {
    console.error("Error during file dialog:", error);
    event.reply("chosenDatabaseFile", null);
  }
});

//the database backup function
ipcMain.on("backupDatabase", () => {
  const dbPath = getdbPath();
  const currentDate = new Date()
    .toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })
    .replace(/[\/,:]/g, "_");

  // Show a dialog to choose the backup location
  const backupPath = dialog.showSaveDialogSync({
    title: "Choose Backup Location",
    defaultPath: path.join(
      app.getAppPath(),
      "backups",
      `backup_${currentDate}.db`
    ), // Modify the default path as needed
    filters: [{ name: "SQLite Databases", extensions: ["db"] }],
  });

  if (backupPath) {
    // Create a writable stream to the backup file
    const backupStream = fs.createWriteStream(backupPath);

    // Create a readable stream from the active database file
    const dbStream = fs.createReadStream(dbPath);

    // Pipe the contents of the active database to the backup file
    dbStream.pipe(backupStream);

    // Optionally, listen for 'finish' event to know when the backup is complete
    backupStream.on("finish", () => {
      // Display a success message to the user
      dialog.showMessageBoxSync({
        type: "info",
        title: "Backup Completed",
        message: "Backup completed successfully.",
      });
    });

    // Optionally, handle errors
    backupStream.on("error", (err) => {
      console.error("Error during backup:", err);
      // Display an error message to the user
      dialog.showErrorBox(
        "Backup Error",
        `Error during backup: ${err.message}`
      );
    });
  }
});

// Register global shortcuts for developer options
app.whenReady().then(() => {
  try {
    globalShortcut.register("CommandOrControl+R", () => {
      try {
        mainWindow.webContents.reload();
      } catch (error) {
        console.error("Error handling F1 shortcut:", error);
      }
    });

    globalShortcut.register("CommandOrControl+Shift+I", () => {
      mainWindow.webContents.toggleDevTools();
    });

    globalShortcut.register("Escape", () => {
      try {
        mainWindow.loadFile("dashboard.html"); // Load dashboard.html when 'Esc' is pressed
      } catch (error) {
        console.error("Error handling F1 shortcut:", error);
      }
    });

    // globalShortcut.register("Shift+Escape", () => {
    //   mainWindow.loadFile("books.html"); // Load dashboard.html when 'Esc' is pressed
    // });

    globalShortcut.register("F1", () => {
      mainWindow.loadFile("sales.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("F2", () => {
      mainWindow.loadFile("purchases.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("F3", () => {
      mainWindow.loadFile("receipts.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("F4", () => {
      mainWindow.loadFile("payments.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("Shift+L", () => {
      mainWindow.loadFile("ledger.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("Shift+C", () => {
      mainWindow.loadFile("P&L.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("Shift+G", () => {
      mainWindow.loadFile("goldPandL.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("Shift+S", () => {
      mainWindow.loadFile("silverPandL.html"); // Load dashboard.html when 'Esc' is pressed
    });

    globalShortcut.register("Shift+I", () => {
      mainWindow.loadFile("stock.html"); // Load dashboard.html when 'Esc' is pressed
    });

    console.log("Global shortcuts registered successfully.");
  } catch (error) {
    console.error("Error registering global shortcuts:", error.message);
  }
  // Create an empty menu
  const menu = Menu.buildFromTemplate([]);

  // Set the menu
  Menu.setApplicationMenu(menu);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the error or terminate the process as needed
});

const memoryUsage = process.memoryUsage();
console.log(`Memory usage: ${JSON.stringify(memoryUsage)}`);

app.on("will-quit", () => {
  try {
    globalShortcut.unregisterAll();
    console.log("Global shortcuts unregistered successfully.");
  } catch (error) {
    console.error("Error unregistering global shortcuts:", error.message);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Perform necessary cleanup or logging.
});
