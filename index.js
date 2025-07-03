const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", () => {
  console.log("✅ Bot is ready");
});

app.post("/assign", async (req, res) => {
  const { user_id, role_ids } = req.body;
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return res.status(404).send("Guild not found");

  try {
    const member = await guild.members.fetch(user_id);
    await Promise.all(
      role_ids.map((roleId) => member.roles.add(roleId))
    );
    res.send("✅ Roles assigned");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to assign roles");
  }
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
