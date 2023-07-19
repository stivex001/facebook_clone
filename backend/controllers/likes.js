import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const { postId } = req.query;

  const q = `SELECT userId FROM likes WHERE postId = ?  `;

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addLikes = (req, res) => {
  const token = req.cookies.access_token;
  const { desc, postId } = req.body;

  if (!token) return res.status(403).json("Not Authorized");

  jwt.verify(token, "mysecret", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token");

    const q =
      "INSERT INTO comments (`desc`, `userId`, `created_at`, `postId`) VALUES(?)";

    const values = [
      desc,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created successfully");
    });
  });
};
