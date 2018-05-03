var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "c4bc1591c939ce5372336c8059d83a8f1d385b28",
      network_id: 4,
      gas: 7920028 // Gas limit used for deploys
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/DPWCCWKE4HS53tNE7xFo")
      },
      network_id: 5,
      gas: 4612388
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/aBdQyWqGRiPfjq43RhJZ")
      },
      network_id: 6,
      gas: 4012388,
      gasPrice: 4000000000
    } 
  }
};
