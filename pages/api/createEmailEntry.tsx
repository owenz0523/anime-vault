import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { createEntry } from "../../app/backend";

type ResponseData = {
  message: string;
};

interface UserData {
  [email: string]: {
    watchedlist: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // More secure to use absolute file path
    const databasePath = "../../adept/anime-vault/pages/api/database.json";
    // Read existing data from the JSON file, if any
    let data;
    try {
      const contents = await fs.promises.readFile(databasePath, "utf-8");
      data = JSON.parse(contents);
    } catch (error) {}

    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required in the request body." });
    }

    if (data[email]) {
      return res
        .status(200)
        .json({ message: "Email already exists in the database." });
    }

    data[email] = { watchedlist: [] };

    await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "UserData object stored!" });
  } catch (error) {
    console.error("Error writing to database:", error);
    res.status(500).json({ message: `Internal server error:` });
  }
}
