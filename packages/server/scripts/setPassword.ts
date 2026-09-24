import { auth } from "../src/auth.ts";

// TODO: 修改這裡
const email = "lqe5qcmwifqc@placeholder.com";
const password = "";

async function setPasswordForEmail() {
  const ctx = await auth.$context;

  const user = await ctx.internalAdapter.findUserByEmail(email);
  if (!user) {
    return console.error("找不到 user");
  }

  const hashed = await ctx.password.hash(password);
  const existing = await ctx.internalAdapter.findAccounts(user.user.id);
  const credentialAccount = existing.find((a) => a.providerId === "credential");

  if (credentialAccount) {
    await ctx.internalAdapter.updateAccount(credentialAccount.id, {
      password: hashed,
    });
  } else {
    await ctx.internalAdapter.createAccount({
      userId: user.user.id,
      providerId: "credential",
      accountId: user.user.id, // credential provider 通常用 userId 當 accountId
      password: hashed,
    });
  }
}

setPasswordForEmail();
