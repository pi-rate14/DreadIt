const { assert } = require("chai");

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
    let result, imageCount;
    const hash = "abc123";

    before(async () => {
      result = await dreadit.uploadImage(hash, "Image description", {
        from: author,
      });
      imageCount = await dreadit.imageCount();
    });

    it("creates images", async () => {
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hashVal, hash, "Hash is correct");
      assert.equal(
        event.description,
        "Image description",
        "description is correct"
      );
      assert.equal(event.tipAmount, "0", "tip amount is correct");
      assert.equal(event.author, author, "author is correct");
      // FAILURE: Image must have hash
      await dreadit.uploadImage("", "Image description", { from: author })
        .should.be.rejected;

      // FAILURE: Image must have description
      await dreadit.uploadImage("Image hash", "", { from: author }).should.be
        .rejected;
    });

    it("lists images", async () => {
      const image = await dreadit.images(imageCount);
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(image.hashVal, hash, "Hash is correct");
      assert.equal(
        image.description,
        "Image description",
        "description is correct"
      );
      assert.equal(image.tipAmount, "0", "tip amount is correct");
      assert.equal(image.author, author, "author is correct");
    });

    it("allows users to tip images", async () => {
      // Track the author balance before purchase
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await dreadit.tipImageOwner(imageCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      });

      // SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hashVal, hash, "Hash is correct");
      assert.equal(
        event.description,
        "Image description",
        "description is correct"
      );
      assert.equal(
        event.tipAmount,
        "1000000000000000000",
        "tip amount is correct"
      );
      assert.equal(event.author, author, "author is correct");

      // Check that author received funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipImageOwner;
      tipImageOwner = web3.utils.toWei("1", "Ether");
      tipImageOwner = new web3.utils.BN(tipImageOwner);

      const expectedBalance = oldAuthorBalance.add(tipImageOwner);

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

      // FAILURE: Tries to tip a image that does not exist
      await dreadit.tipImageOwner(99, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
