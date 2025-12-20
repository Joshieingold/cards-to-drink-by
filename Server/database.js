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

// Get a random card
export const GetCard = () => {
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM cards ORDER BY RAND() LIMIT 1;";
    pool.query(queryString, (err, results) => {
      if (err) {
        console.log("Database error:", err);
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Add a new card
export const AddCard = ({ title, desc, user }) => {
  return new Promise((resolve, reject) => {
    const queryString = `
      INSERT INTO cards (title, description, truth_count, drink_count, creator)
      VALUES (?, ?, 0, 0, ?)
    `;
    pool.query(queryString, [title, desc, user], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Increment truth_count or drink_count for a given card
export const IncrementCardCount = ({ cardID, choice }) => {
  return new Promise((resolve, reject) => {
    if (!cardID || !choice || !["truth", "drink"].includes(choice)) {
      return reject(new Error("Invalid cardID or choice"));
    }

    const field = choice === "truth" ? "truth_count" : "drink_count";
    const queryString = `UPDATE cards SET ${field} = ${field} + 1 WHERE id = ?`;

    pool.query(queryString, [cardID], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const CreateCard = ({title, description, creator}) => {

  pool.query(
    "INSERT INTO cards (title, description, creator) VALUES (?, ?, ?)",
    [title, description, creator],
    (err) => {
      if (err) {
        console.error("Failed to insert card:", err);
        return;
      }
      console.log("Card added successfully");
    }
  );
}
export const GetFiveCards = async () => {
  const promisePool = pool.promise();
  const [rows] = await promisePool.query(
    "SELECT id, title, description FROM cards ORDER BY RAND() LIMIT 5"
  );
  return rows;
};