const DB = require("../models/user");
const fs = require("fs");
const { encode } = require("../ultis/helper");
const { json } = require("express");

module.exports = {
  migrator: () => {
    const data = fs.readFileSync("./migrations/user.json");
    const user = JSON.parse(data);

    user.map(async (i) => {
      i.password = encode(i.password);
      await new DB(i).save();
    });
  },
  backup: async () => {
    const data = await DB.find();
    await fs.writeFileSync(
      "./migrations/BackUp/user.json",
      JSON.stringify(data)
    );
  },
};
