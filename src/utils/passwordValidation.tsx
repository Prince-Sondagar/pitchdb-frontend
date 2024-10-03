export const passwordValidation = (password: string) => {
  const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
  const regexTest = passwordRegex.test(password);
  return regexTest;
};
