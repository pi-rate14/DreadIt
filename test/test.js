const Dreadit = artifacts.require("./Dreadit.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Dreadit", ([deployer, author, tipper]) => {
  let dreadit;

  before(async () => {
    dreadit = await Dreadit.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await dreadit.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await dreadit.name();
      assert.equal(name, "DreadIt");
    });
  });

  describe("images", async () => {
    let result;
    it("creates images", async () => {
      result = await dreadit.uploadImage();
      let image = await dreadit.images(1);
      console.log(image);
    });
  });
});
