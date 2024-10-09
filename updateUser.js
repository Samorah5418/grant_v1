require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/UserModel"); // Update with the actual path to your User model

async function migrateUserImages() {
  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
    family: 4
    });

    console.log("Connected to database");

    // Find all users with the old image format
    const users = await User.find({ image: { $type: "object" } });

    console.log(`Users with old image format: ${users.length}`);
    console.log(`Found users:`, users); // Log the found users

    // Iterate over each user and update the image field and add family property
    for (const user of users) {
      // Check if the image is an object and has a url property
      if (user.image && typeof user.image === "object" && user.image.url) {
        user.image = user.image.url; // Update to the URL string
        user.family = 4; // Set the family size to 4
        await user
          .save()
          .catch((err) =>
            console.error(`Error saving user ID ${user._id}:`, err)
          ); // Error logging
        console.log(`Updated user ID: ${user._id}`);
      }
    }

    console.log(`Successfully updated ${users.length} users.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Run the migration
migrateUserImages();
