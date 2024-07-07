// exports.createNewDatabase = (dbName, fromDate, toDate) => {
//   const appDirectory = path.dirname(process.execPath);
//   const dataDirectory = path.join(appDirectory, "data");
//   const dbPath = path.join(dataDirectory, `${dbName}_${fromDate}_${toDate}.db`);

//   console.log("dbname", dbName);

//   console.log("database path", dbPath);

//   // Create the 'data' directory if it doesn't exist
//   if (!fs.existsSync(dataDirectory)) {
//     fs.mkdirSync(dataDirectory);
//   }

//   // Check if the database file exists, and create it if not
//   if (!fs.existsSync(dbPath)) {
//     fs.writeFileSync(dbPath, "");
//   }

//   const db = new sqlite3.Database(dbPath);

//   // Add your db.run queries here...

//   // Example:
//   db.run(
//     "CREATE TABLE IF NOT EXISTS ledgers (id INTEGER PRIMARY KEY, name TEXT, under TEXT, ledger_OpnBal REAL, dr_cr TEXT)"
//   );

//   db.close();
// };

// exports.fetchDatabaseList = () => {
//   // Fetch the list of databases from the 'data' directory
//   const appDirectory = path.dirname(process.execPath);
//   const dataDirectory = path.join(appDirectory, "data");

//   if (!fs.existsSync(dataDirectory)) {
//     return [];
//   }

//   const databaseFiles = fs.readdirSync(dataDirectory);
//   return databaseFiles.filter((file) => file.endsWith(".db"));
// };

// // const sqlite3 = require("sqlite3").verbose();

// // Declare an activeDb variable outside the function
// let activeDb = null;

// // Function to connect to the database
// exports.connectToDatabase = (dbPath) => {
//   return new Promise((resolve, reject) => {
//     // Close the current active database if it exists
//     if (activeDb) {
//       console.log("Closing the current active database.");
//       activeDb.close((err) => {
//         if (err) {
//           console.error("Error closing the database:", err.message);
//           reject(err);
//         } else {
//           console.log("Current active database closed successfully.");
//           activeDb = null;
//           // Create a new database connection
//           activeDb = new sqlite3.Database(dbPath);
//           console.log("New active database is:", activeDb);
//           resolve(activeDb);
//         }
//       });
//     } else {
//       // If there is no active database, create a new database connection
//       activeDb = new sqlite3.Database(dbPath);
//       console.log("New active database is:", activeDb);
//       resolve(activeDb);
//     }
//   });
// };

// const { dialog } = require("electron").remote;

// exports.backupDatabase = () => {
//   // Show a dialog to choose the backup location
//   const backupPath = dialog.showSaveDialogSync({
//     title: "Choose Backup Location",
//     defaultPath: path.join(appDirectory, "backups", "backup.db"), // Modify the default path as needed
//     filters: [{ name: "SQLite Databases", extensions: ["db"] }],
//   });

//   if (backupPath) {
//     // Create a writable stream to the backup file
//     const backupStream = fs.createWriteStream(backupPath);

//     // Create a readable stream from the active database file
//     const dbStream = fs.createReadStream(dbPath);

//     // Pipe the contents of the active database to the backup file
//     dbStream.pipe(backupStream);

//     // Optionally, listen for 'finish' event to know when the backup is complete
//     backupStream.on("finish", () => {
//       console.log("Backup completed successfully.");
//     });

//     // Optionally, handle errors
//     backupStream.on("error", (err) => {
//       console.error("Error during backup:", err);
//     });
//   }
// };

// Helper functions to get debtors and creditors data
const getDebtors = async () => {
  const debtors = [];
  const ledgers = await window.api.getLedgers();

  const sundryDebtors = ledgers
    .filter((ledger) => ledger.under === "Sundry-Debtor")
    .map((ledger) => ledger.name)
    .sort((a, b) => a.localeCompare(b));

  for (const name of sundryDebtors) {
    const { totalDebit, totalCredit } = await calculateDebtorsBalance(name);
    const closingBalance = totalCredit - totalDebit;
    const dr_cr = closingBalance < 0 ? "Debit" : "Credit";
    debtors.push({ name, closingBalance, dr_cr });
  }
  return debtors;
};

const getCreditors = async () => {
  const creditors = [];
  const ledgers = await window.api.getLedgers();

  const sundryCreditors = ledgers
    .filter((ledger) => ledger.under === "Sundry-Creditor")
    .map((ledger) => ledger.name)
    .sort((a, b) => a.localeCompare(b));

  for (const name of sundryCreditors) {
    const { totalDebit, totalCredit } = await calculateCreditorsBalance(name);
    const closingBalance = totalCredit - totalDebit;
    const dr_cr = closingBalance < 0 ? "Debit" : "Credit";
    creditors.push({ name, closingBalance, dr_cr });
  }
  return creditors;
};

const exportDatabase = async () => {
  try {
    const ledgers = await window.api.getLedgers();
    const debtors = await getDebtors();
    const creditors = await getCreditors();

    // Clear current entries
    await window.api.clearLedgers();

    // Prepare new data
    const newLedgers = [...debtors, ...creditors].map(
      ({ name, closingBalance, dr_cr }) => ({
        name,
        under: dr_cr === "Debit" ? "Sundry-Debtor" : "Sundry-Creditor",
        ledger_OpnBal: closingBalance,
        dr_cr,
      })
    );

    // Insert new data
    await window.api.addLedgers(newLedgers);

    // Export database file
    const dbPath = path.join(__dirname, "path_to_your_database_file.db");
    const exportPath = path.join(__dirname, "exported_database.db");
    fs.copyFile(dbPath, exportPath, (err) => {
      if (err) throw err;
      console.log("Database exported successfully");
    });
  } catch (error) {
    console.error("Error exporting database:", error);
  }
};

exports.getdbPath = () => {
  const appDirectory = path.dirname(app.getPath("exe"));
  const dataDirectory = path.join(appDirectory, "data");

  // Get all files in the data directory
  const files = fs.readdirSync(dataDirectory);

  // Find the first file with .db extension
  const dbFile = files.find((file) => path.extname(file) === ".db");

  // If a .db file is found, return its path
  if (dbFile) {
    return path.join(dataDirectory, dbFile);
  } else {
    // If no .db file is found, return null or throw an error, depending on your preference
    return null;
    // Alternatively, you can throw an error if no .db file is found
    // throw new Error('No .db file found in the data directory');
  }
};

// exports.getdbPath = () => {
//   const appDirectory = path.dirname(app.getPath("exe"));
//   const dataDirectory = path.join(appDirectory, "data");
//   const dbPath = path.join(dataDirectory, "database.db");
//   return dbPath;
// };

const { app, ipcRenderer, remote, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const appDirectory = path.dirname(process.execPath);
const dataDirectory = path.join(appDirectory, "data");

// Create the 'data' directory if it doesn't exist
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

// Get all files in the data directory
const files = fs.readdirSync(dataDirectory);

// Find the first file with .db extension
const dbFile = files.find((file) => path.extname(file) === ".db");

// If a .db file is found, use it as the database path
let dbPath;
if (dbFile) {
  dbPath = path.join(dataDirectory, dbFile);
  console.log("database path", dbPath);
} else {
  // If no .db file is found, create a new .db file
  dbPath = path.join(dataDirectory, "new_database.db");
  console.log("new database path", dbPath);

  // Create the new .db file
  fs.writeFileSync(dbPath, "");
}

// Check if the database file exists, and create it if not
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

// Now you can proceed with using the dbPath as the database file

//the data restore function is not needed as the file name
// is "database" and any backup file can be renamed and
// replaced with the database file in the data folder
// after installation.

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbPath);

// exports.backupDatabase = async () => {
//   const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

//   try {
//     const { filePath } = await window.api.showSaveDialog({
//       title: "Choose Backup Location",
//       defaultPath: path.join(
//         appDirectory,
//         "data",
//         "backups",
//         `backup_${currentDate}.sql`
//       ),
//       filters: [{ name: "SQL Files", extensions: ["sql"] }],
//     });

//     if (filePath) {
//       const sqlCommands = await generateSQLCommands(); // Implement a function to generate SQL commands
//       await window.api.backupDatabase(filePath, sqlCommands);
//       console.log("Backup completed successfully.");
//     }
//   } catch (error) {
//     console.error("Error during save dialog:", error);
//   }
// };
// exports
//   .connectToDatabase(dbPath)
//   .then((db) => {
// Now you can use the 'db' connection here

// Continue with your database operations...

// const fs = require("fs");
// const dbPath = "./database.db";
// const sqlite3 = require("sqlite3").verbose();

// if (!fs.existsSync(dbPath)) {
//   fs.writeFileSync(dbPath, "");
// }

// const db = new sqlite3.Database(dbPath);

// //Creating the closing table
// db.run(
//   "CREATE TABLE IF NOT EXISTS closing (id INTEGER PRIMARY KEY, name TEXT, under TEXT, ledger_CloBal REAL, dr_cr TEXT)"
// );

// exports.addLedgers = (name, under, ledger_OpnBal, dr_cr) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "INSERT INTO closing (name, under, ledger_CloBal, dr_cr) VALUES (?,?,?,?)";
//     db.run(sql, [name, under, ledger_OpnBal, dr_cr], (error) => {
//       if (error) {
//         console.error("Error adding data:", error);
//         reject(error);
//       } else {
//         console.log("Data added successfully:");
//         resolve();
//       }
//     });
//   });
// };

//Creating the ledgers table
db.run(
  "CREATE TABLE IF NOT EXISTS ledgers (id INTEGER PRIMARY KEY, name TEXT, under TEXT, ledger_OpnBal REAL, dr_cr TEXT)"
);

exports.addLedgers = (name, under, ledger_OpnBal, dr_cr) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO ledgers (name, under, ledger_OpnBal, dr_cr) VALUES (?,?,?,?)";
    db.run(sql, [name, under, ledger_OpnBal, dr_cr], (error) => {
      if (error) {
        console.error("Error adding data:", error);
        reject(error);
      } else {
        console.log("Data added successfully:");
        resolve();
      }
    });
  });
};

//fetching ledger data
exports.getLedgers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM ledgers ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Ledgers: ", error);
        reject(error);
      } else {
        console.log("Ledgers retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//fetching ledger names
exports.getLedgerNames = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT name FROM ledgers";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading ledger names: ", error);
        reject(error);
      } else {
        console.log("Ledger names retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//fetching sundry creditors from ledgers
exports.getCreditors = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, name, ledger_OpnBal FROM ledgers WHERE under = 'Sundry-Creditor'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching sundry creditors: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//fetching sundry Debtors from ledgers
exports.getDebtors = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, name, ledger_OpnBal FROM ledgers WHERE under = 'Sundry-Debtor'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching sundry Debtors: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//fetching Cash-in-hand from ledgers
exports.getCash = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT name, ledger_OpnBal FROM ledgers WHERE under = 'Cash-in-hand'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching Cash in hand: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//fetching ledger-name if exists
exports.checkIfNameExists = (ledgerName, callback) => {
  const query = `SELECT COUNT(*) as count FROM ledgers WHERE name = ?`;
  db.get(query, [ledgerName], (err, row) => {
    if (err) {
      console.error("Error checking name:", err);
      callback(err, null);
    } else {
      callback(null, row.count > 0);
    }
  });
};

//fetching name suggestions from ledgers
exports.getSuggestions = (partialName, callback) => {
  const query = `SELECT name FROM ledgers WHERE name LIKE ?`;
  const partialNameWithWildcard = "%" + partialName + "%";

  db.all(query, [partialNameWithWildcard], (err, rows) => {
    if (err) {
      console.error("Error fetching suggestions:", err);
      callback(err, null);
    } else {
      const suggestions = rows.map((row) => row.name);
      callback(null, suggestions);
    }
  });
};

/*
exports.checkIfNameExists = async (ledgerName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM ledgers WHERE name = ?`;
    db.get(query, [ledgerName], (err, row) => {
      if (err) {
        console.error("Error checking name:", err);
        reject(err);
      } else {
        resolve(row.count > 0);
      }
    });
  });
};
*/
//delete ledgers
exports.deleteLedgers = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query to delete the sale with the specified ID
    const sql = "DELETE FROM ledgers WHERE id = ?";

    // Execute the SQL query with the provided ID
    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting ledger:", error);
        reject(error);
      } else {
        console.log(`Ledger with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//Creating Sales table
db.run(
  "CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY, saleType TEXT, date DATE, name TEXT, item TEXT, fine_weight REAL, rate REAL, amount REAL, narration TEXT)"
);

exports.addSales = (
  saleType,
  date,
  name,
  item,
  fine_weight,
  rate,
  amount,
  narration
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO sales (saleType, date, name, item, fine_weight, rate, amount, narration) VALUES (?,?,?,?,?,?,?,?)";
    db.run(
      sql,
      [saleType, date, name, item, fine_weight, rate, amount, narration],
      (error) => {
        if (error) {
          console.error("Error adding data:", error);
          reject(error);
        } else {
          console.log("Data added successfully:");
          resolve();
        }
      }
    );
  });
};

//Sales table show entry
exports.getSales = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM sales ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading sales: ", error);
        reject(error);
      } else {
        console.log("Sales retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Sales table show pages
exports.getSalesPages = (page, pageize) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM sales ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading sales: ", error);
        reject(error);
      } else {
        console.log("Sales retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales gold only
exports.getSalesGold = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount, fine_weight FROM sales where item = 'Fine-Gold-Sale'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold Sales: ", error);
        reject(error);
      } else {
        console.log("Gold Sales retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales gold cash only
exports.getSalesGoldCash = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM sales where item = 'Fine-Gold-Sale' AND saleType = 'Cash'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold Sales cash: ", error);
        reject(error);
      } else {
        console.log("Gold Sales cash retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales gold bill only
exports.getSalesGoldBill = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM sales where item = 'Fine-Gold-Sale' AND saleType = 'Bill'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold Sales Bill: ", error);
        reject(error);
      } else {
        console.log("Gold Sales Bill retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales silver only
exports.getSalesSilver = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight ,amount FROM sales where item = 'Fine-Silver-Sale'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Silver Sales: ", error);
        reject(error);
      } else {
        console.log("Silver Sales retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales silver cash only
exports.getSalesSilverCash = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM sales where item = 'Fine-Silver-Sale' AND saleType = 'Cash'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Silver Sales cash: ", error);
        reject(error);
      } else {
        console.log("Silver Sales cash retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//getSales silver bill only
exports.getSalesSilverBill = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM sales where item = 'Fine-Silver-Sale' AND saleType = 'Bill'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Silver Sales Bill: ", error);
        reject(error);
      } else {
        console.log("Silver Sales Bill retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//delete sales
exports.deleteSale = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query to delete the sale with the specified ID
    const sql = "DELETE FROM sales WHERE id = ?";

    // Execute the SQL query with the provided ID
    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting sale:", error);
        reject(error);
      } else {
        console.log(`Sale with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//get all the outstanding balance from sales table
exports.getOutstandingSales = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, name, outstanding FROM sales";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching outstanding balance: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get all the amount balance from sales table
exports.getAmountSales = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT amount FROM sales";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching outstanding balance: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//Creating Purchases table
db.run(
  "CREATE TABLE IF NOT EXISTS purchases (id INTEGER PRIMARY KEY, purchaseType TEXT, date DATE, name TEXT, item TEXT, gross_weight, purity, fine_weight REAL, refine_weight REAL, rate REAL, amount REAL, narration TEXT)"
);

exports.addPurchases = (
  purchaseType,
  date,
  name,
  item,
  gross_weight,
  purity,
  fine_weight,
  refine_weight,
  rate,
  amount,
  narration
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO purchases (purchaseType, date, name, item, gross_weight, purity, fine_weight, refine_weight, rate, amount, narration) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    db.run(
      sql,
      [
        purchaseType,
        date,
        name,
        item,
        gross_weight,
        purity,
        fine_weight,
        refine_weight,
        rate,
        amount,
        narration,
      ],
      (error) => {
        if (error) {
          console.error("Error adding data:", error);
          reject(error);
        } else {
          console.log("Data added successfully:");
          resolve();
        }
      }
    );
  });
};

//Purchases table show entry
exports.getPurchases = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM purchases ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading purchases: ", error);
        reject(error);
      } else {
        console.log("Purchases retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases gold only
exports.getPurchasesGold = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount, fine_weight, refine_weight FROM purchases where (item = 'Fine-Gold-Purchase' OR item = 'Gold-Lagadi-Purchase')`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold purchases: ", error);
        reject(error);
      } else {
        console.log("Gold Purchases retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases gold only Cash
exports.getPurchasesGoldCash = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM purchases WHERE (item = 'Fine-Gold-Purchase' OR item = 'Gold-Lagadi-Purchase') AND purchaseType = 'Cash'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold purchases Cash: ", error);
        reject(error);
      } else {
        console.log("Gold Purchases Cash retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases gold only Bill
exports.getPurchasesGoldBill = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM purchases where (item = 'Fine-Gold-Purchase' OR item = 'Gold-Lagadi-Purchase') AND purchaseType = 'Bill'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold purchases Bill: ", error);
        reject(error);
      } else {
        console.log("Gold Purchases Bill retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases silver only Cash
exports.getPurchasesSilverCash = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM purchases where (item = 'Fine-Silver-Purchase' OR item = 'Silver-Gat-Purchase') AND purchaseType = 'Cash'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Silver purchases Cash: ", error);
        reject(error);
      } else {
        console.log("Silver Purchases Cash retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases silver only Bill
exports.getPurchasesSilverBill = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM purchases where (item = 'Fine-Silver-Purchase' OR item = 'Silver-Gat-Purchase') AND purchaseType = 'Bill'`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Silver purchases Bill: ", error);
        reject(error);
      } else {
        console.log("Silver Purchases Bill retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//Purchases silver only
exports.getPurchasesSilver = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT fine_weight, amount FROM purchases where (item = 'Fine-Silver-Purchase' OR item = 'Silver-Gat-Purchase')`;
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Gold purchases: ", error);
        reject(error);
      } else {
        console.log("Gold Purchases retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//delete purchases
exports.deletePurchase = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query to delete the purchase with the specified ID
    const sql = "DELETE FROM purchases WHERE id = ?";

    // Execute the SQL query with the provided ID
    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting purchase:", error);
        reject(error);
      } else {
        console.log(`purchase with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//get all the outstanding balance from sales table
exports.getOutstandingPurchases = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT name, outstanding FROM purchases";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching outstanding balance: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

exports.getAmountPurchases = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT amount, fine_weight FROM purchases";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching amount balance: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//Creating Payments table
db.run(
  "CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, type TEXT, date DATE, name TEXT, amount REAL, narration TEXT)"
);

exports.addPayments = (type, date, name, amount, narration) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO payments (type, date, name, amount, narration) VALUES (?,?,?,?,?)";
    db.run(sql, [type, date, name, amount, narration], (error) => {
      if (error) {
        console.error("Error adding data:", error);
        reject(error);
      } else {
        console.log("Data added successfully:");
        resolve();
      }
    });
  });
};

//payments table show entry
exports.getPayments = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM payments ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading payments: ", error);
        reject(error);
      } else {
        console.log("Payments retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//delete payments
exports.deletePayments = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query to delete the purchase with the specified ID
    const sql = "DELETE FROM payments WHERE id = ?";

    // Execute the SQL query with the provided ID
    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting payments:", error);
        reject(error);
      } else {
        console.log(`payments with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//get all the amount balance from payments table
exports.getAmountPayments = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount FROM payments WHERE type ='Cash-Payment'`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching paid amount: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//Creating receipts table
db.run(
  "CREATE TABLE IF NOT EXISTS receipts (id INTEGER PRIMARY KEY, type TEXT, date DATE, name TEXT, amount REAL, narration TEXT)"
);

exports.addReceipts = (type, date, name, amount, narration) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO receipts (type, date, name, amount, narration) VALUES (?,?,?,?,?)";
    db.run(sql, [type, date, name, amount, narration], (error) => {
      if (error) {
        console.error("Error adding data:", error);
        reject(error);
      } else {
        console.log("Data added successfully:");
        resolve();
      }
    });
  });
};

//payments table show entry
exports.getReceipts = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM receipts ORDER BY id DESC";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading receipts: ", error);
        reject(error);
      } else {
        console.log("Receipts retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//delete receipts
exports.deleteReceipts = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query to delete the purchase with the specified ID
    const sql = "DELETE FROM receipts WHERE id = ?";

    // Execute the SQL query with the provided ID
    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting receipts:", error);
        reject(error);
      } else {
        console.log(`receipts with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//get all the amount balance from receipts table
exports.getAmountReceipts = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount FROM receipts WHERE type = "Cash-Receipt"`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching received amount: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//Creating stock table
db.run(
  "CREATE TABLE IF NOT EXISTS stock (id INTEGER PRIMARY KEY, date DATE, item TEXT, gross_weight, purity, fine_weight REAL, rate REAL, amount REAL)"
);

exports.addStock = (
  date,
  item,
  gross_weight,
  purity,
  fine_weight,
  rate,
  amount
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO stock (date, item, gross_weight, purity, fine_weight, rate, amount) VALUES (?,?,?,?,?,?,?)";
    db.run(
      sql,
      [date, item, gross_weight, purity, fine_weight, rate, amount],
      (error) => {
        if (error) {
          console.error("Error adding data:", error);
          reject(error);
        } else {
          console.log("Data added successfully:");
          resolve();
        }
      }
    );
  });
};

//Get Stock
exports.getStock = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM stock";
    db.all(sql, [], (error, rows) => {
      if (error) {
        console.log("Error loading Stock: ", error);
        reject(error);
      } else {
        console.log("Stock retrieved successfully: ", rows);
        resolve(rows);
      }
    });
  });
};

//delete stock
exports.deleteStock = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM stock WHERE id = ?";

    db.run(sql, id, function (error) {
      if (error) {
        console.error("Error deleting stock:", error);
        reject(error);
      } else {
        console.log(`Stock with ID ${id} deleted successfully.`);
        resolve();
      }
    });
  });
};

//get all the amount balance from stock table
exports.getAmountStock = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT amount FROM stock";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching stock amount: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get fine-gold stock
exports.getFineGold = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount, fine_weight FROM stock WHERE item = 'fine-gold'`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching gold: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get fine-silver stock
exports.getFineSilver = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount, fine_weight FROM stock WHERE item = 'fine-silver'`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching fine-silver: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get gold-lagadi stock
exports.getGoldLagadi = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount FROM stock WHERE item = 'gold-lagadi'`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching gold-lagadi: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get silver-gat stock
exports.getSilverGat = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT amount FROM stock WHERE item = 'silver-gat'`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching silver-gat: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get all the payable balance from purchases table
exports.getOutstandingPayments = () => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT id, name, outstanding, date
    FROM purchases
    WHERE outstanding > 0;
  `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching payable amount from purchases: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};

//get all the receivable balance from sales table
exports.getOutstandingReceipts = () => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT id, name, outstanding, date
    FROM sales
    WHERE outstanding > 0;
  `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error fetching receivable amount from sales: ", err);
        //callback(err, null);
        reject(err);
      } else {
        console.log(rows);
        //callback(null, rows);
        resolve(rows);
      }
    });
  });
};
//   console.log("Database connected successfully");
// })
// .catch((error) => {
//   console.error("Error connecting to the database:", error);
// });
