import * as fs from "fs";
import cron from "node-cron";
import { UPLOAD_PATH } from "$env/static/private";

function scheduleTempCleanup() {
  // Schedule the cleanup task to run every day at midnight
  cron.schedule("0 0 * * *", () => {
    console.log("Running daily temp cleanup task...");

    // Get a list of all files in the ./temp folder
    fs.readdir(`temp`, (err, files) => {
      if (err) {
        console.error(`Error reading ./temp folder: ${err}`);
        return;
      }

      // Loop through each file in the folder and delete it
      files.forEach((file) => {
        fs.unlink(`./temp/${file}`, (err) => {
          if (err) {
            console.error(`Error deleting file ${file}: ${err}`);
            return;
          }

          console.log(`Deleted file ${file}`);
        });
      });
    });
  });
}

// Call the function to start scheduling the task
scheduleTempCleanup();
