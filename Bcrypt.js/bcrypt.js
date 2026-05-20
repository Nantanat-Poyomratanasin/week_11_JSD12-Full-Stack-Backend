import bcrypt from "bcrypt";

async function hashPassword(string) {
  const hashedPassword = await bcrypt.hash(string, 12);
  return hashedPassword;
}

// const password = await hashPassword("john456");
// console.log(password);

console.log(
  await bcrypt.compare(
    "john456",
    "$2b$12$Qi53gY4QozW.1IgQ9OmPwOGt0S7TypzIRaq/kgeba3HKxEfaZ7CJK",
  ),
);
