const sanitizePost = (post) => {
  const propertiesToHide = [];
  propertiesToHide.forEach((property) => (post[property] = undefined));
  return post; // this line is optional as the modification is done in place
};

export default sanitizePost;
