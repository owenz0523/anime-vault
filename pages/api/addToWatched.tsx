"use server";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

interface Database {
  [email: string]: {
    watchedlist: string[];
  };
}

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log("Reached API store handler");
  console.log(req.body);
  // Absolute file path is more reliable
  let data;
  const databasePath = "../../adept/anime-vault/pages/api/database.json";
  try {
    const contents = await fs.promises.readFile(databasePath, "utf-8");
    data = JSON.parse(contents);
    console.log(contents);
    console.log("Parsed database");
  } catch (e) {
    console.log("Error reading database");
    return res
      .status(400)
      .json({ message: "Internal server error: Database Not Found" });
  }
  if (!req.body.email || !req.body.index) {
    return res
      .status(400)
      .json({ message: "Index or email not included in body" });
  }
  const email = req.body.email;
  const animeClicked = req.body.index.toString();
  console.log(email);
  console.log(animeClicked);
  if (data[email].watchedlist.indexOf(animeClicked) === -1) {
    data[email].watchedlist.push(animeClicked);
  } else {
    data[email].watchedlist.splice(
      data[email].watchedlist.indexOf(animeClicked),
      1
    );
  }

  try {
    await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: "Write successful" });
  } catch (e) {
    console.log("Error writing to database");
    return res.status(400).json({ message: "Failed write operation" });
  }
}
