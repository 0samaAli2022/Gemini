const sanitizeUser = (user) => {
  const propertiesToHide = [
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetTokenExpire',
    'passwordResetTokenVerified',
    'emailVerificationToken',
    'createdAt',
    'updatedAt',
  ];
  propertiesToHide.forEach((property) => (user[property] = undefined));
  return user; // this line is optional as the modification is done in place
};

export default sanitizeUser;
