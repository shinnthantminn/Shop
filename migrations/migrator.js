const userDB = require("../models/user");
const permitDB = require("../models/permit");
const roleDB = require("../models/role");
const fs = require("fs");
const { encode } = require("../ultis/helper");

const check = (data, name, db) => {
  return data.map(async (i) => {
    const obj = {};
    obj[name] = i[name];
    const collection = await db.findOne(obj);
    if (collection === null) {
      if (i.email) {
        i.password = encode(i.password);
      }
      await new db(i).save();
    }
  });
};

module.exports = {
  migrator: async () => {
    const userData = fs.readFileSync("./migrations/user.json"),
      roleData = fs.readFileSync("./migrations/Role.json"),
      permitData = fs.readFileSync("./migrations/permit.json"),
      user = JSON.parse(userData),
      permit = JSON.parse(permitData),
      role = JSON.parse(roleData);

    check(user, "email", userDB);
    check(permit, "name", permitDB);
    check(role, "name", roleDB);

    const owner = await userDB.findOne({ name: "Shinn Thant Minn" });
    const CEO = await roleDB.findOne({ name: "CEO" });
    if (owner && CEO) {
      const check = owner.role.find((i) => i.equals(CEO._id));
      if (check) {
        return;
      } else {
        await userDB.findByIdAndUpdate(owner._id, { $push: { role: CEO._id } });
      }
    }
  },
  backup: async () => {
    const data = await userDB.find();
    await fs.writeFileSync(
      "./migrations/BackUp/user.json",
      JSON.stringify(data)
    );
  },
};
