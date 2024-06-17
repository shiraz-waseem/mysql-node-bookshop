const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json()); // allows us to send any json file
app.use(cors());

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "admin", // if no password keep it empty as ""
  database: "test", // db name is test. tables name is books
});

// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

const port = 8000;

app.get("/", (req, res) => {
  res.json("Hello this is the backend");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  // upper jo db banaya using that we can run any query
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("Here");
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`,`desc`,`price`,`cover`) VALUES (?)"; // req.body.title, req.body.desc but its better ? krke neeche bta do

  // dummy data likh ke bhi try krskty..
  //   const values = ["abcd", "xyz", "11", "11.png"];
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  // ? ki jagah jo chez ani
  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  // all the values at this bookId
  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(port, () => {
  console.log(`listening to port no ${port}`);
});
