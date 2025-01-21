"use server";

import fs from "fs";

let emailDatabase: UserData = require("../pages/api/database.json");

interface UserData {
  [email: string]: {
    watchedlist: string[];
  };
}

export async function createEntry(email: string) {
  if (email == null) {
    return;
  }
  if (!emailDatabase[email]) {
    // If email doesn't exist, create a new entry
    emailDatabase[email] = { watchedlist: [] };
    // Write the updated database to the JSON file asynchronously
    await fs.writeFile(
      "../pages/api/database.json",
      JSON.stringify(emailDatabase, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to database:", err);
        } else {
          console.log(`New entry created for email: ${email}`);
        }
      }
    );
  } else {
    console.log(`Email entry already exists for: ${email}`);
  }
}
