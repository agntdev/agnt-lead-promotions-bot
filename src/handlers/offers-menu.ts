import { Composer } from "grammy";

// SCAFFOLD — generated from the bot blueprint BEFORE the agent runs.
// Keep a LIVE registration (.command / .callbackQuery / …) so this feature is
// never an empty stub. Replace the reply body with real logic + copy; if you
// change the user-facing text, update tests/specs to match EXACTLY.
// Do NOT rewrite src/bot.ts — buildBot() already auto-loads this module.
// Menu: wire this into /start via registerMainMenuItem({ label: "Learn offers", data: "offers:menu" }) if the toolkit exposes it.

const composer = new Composer();

composer.callbackQuery("offers:menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Display service/offer details with follow-up options");
});

export default composer;
