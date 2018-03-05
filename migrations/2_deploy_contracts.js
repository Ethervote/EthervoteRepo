var Ethervote = artifacts.require("./Ethervote.sol");

module.exports = function(deployer) {
  deployer.deploy(Ethervote);
};