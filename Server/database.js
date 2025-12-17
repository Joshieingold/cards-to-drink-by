import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "truth_or_drink",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function GetCard() {
  let queryString = "SELECT * FROM cards ORDER BY RAND() LIMIT 1;";
  pool.query(queryString, (err, results) => {
    if (err) {
      console.log("There was a database Error: ", err);
      return err, null;
    }
    return null, results[0];
  });
}