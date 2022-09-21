const sqlite3 = require('sqlite3').verbose();
const dotenv = require("dotenv");
dotenv.config();

const dbPath = process.env.DB_PATH;

const checkRegisteredUser = (userAddress) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the apidb database.');
    });
  
    let sql = `SELECT * FROM payments
                WHERE pay_address  = ?`;

    db.all(sql, [userAddress], (err, row) => {
      if (err) {
        // return console.error(err.message);
        reject(err)
      }
      resolve(row)
    })

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  })
}

const registerUser = (user) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the apidb database.');
    });
  
    let insertQuery = `INSERT INTO payments(pay_name, pay_address, pay_status, pay_amount) VALUES(?, ?, 0, 0)`;

    let selectQuery = `SELECT * FROM payments WHERE pay_address  = ?`;

    console.log('[user object check]', user)

    db.serialize(() => {
      // Queries scheduled here will be serialized.
      db.run(insertQuery, [user.name, user.address])
        .all(selectQuery, [user.address], (err, row) => {
          if (err){
            reject(err)
          }
          resolve(row)
        });
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  })
}

module.exports = {
  checkRegisteredUser,
  registerUser,
}