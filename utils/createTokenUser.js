const { isWeakMap } = require("util/types");

const createTokenUser = (user) => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    othername: user.othername,
    income: user.income,
    occupation: user.occupation,
    amount: user.amount,
    email: user.email,
    gender: user.gender,
    reason: user.reason,
    phone: user.phone,
    state: user.state,
    dob: user.dob,
    creditscore: user.creditscore,
    isApproved: user.isApproved,
    image: user.image,
    address: user.address,
    // name_of_kin: user.name_of_kin,
    // email_of_kin: user.email_of_kin,
    // phone_of_kin: user.phone_of_kin,
    // relationship_of_kin: user.relationship_of_kin,
    // account_currency: user.account_currency,
    // passportPhoto: user.passportPhoto,
    // identification_photograph: user.identification_photograph,
    role: user.role,
    userId: user._id,
    role: user.role,
  };
};





module.exports = createTokenUser;
