const userDB = require("../model/user");
const permitDB = require("../model/permit");
const roleDB = require("../model/role");
const fs = require("fs");
const helper = require("../ulits/helper");

const checker = (data, name, db) => {
  data.map(async (i) => {
    const obj = {};
    obj[name] = i[name];
    const result = await db.findOne(obj);
    if (result === null) {
      if (i.email) {
        i.password = helper.encode(i.password);
      }
      await new db(i).save();
    }
  });
};

module.exports = {
  migrator: async () => {
    const userData = fs.readFileSync("./migration/data/migrateUserData.json");
    const permitData = fs.readFileSync(
      "./migration/data/migratePermitData.json"
    );
    const roleData = fs.readFileSync("./migration/data/migrateRoleData.json");
    const user = JSON.parse(userData);
    const permit = JSON.parse(permitData);
    const role = JSON.parse(roleData);

    checker(user, "email", userDB);
    checker(permit, "name", permitDB);
    checker(role, "name", roleDB);

    const owner = await userDB.findOne({ name: "Shinn Thant Minn" });
    const CEO = await roleDB.findOne({ name: "CEO" });
    if (owner && CEO) {
      const result = owner.role.find((i) => i.equals(CEO._id));
      if (!result) {
        await userDB.findByIdAndUpdate(owner._id, { $push: { role: CEO._id } });
      }
    }
  },
  backUp: async () => {
    const data = await userDB.find();
    await fs.writeFileSync(
      "./migration/data/backUserData.json",
      JSON.stringify(data)
    );
  },
};
