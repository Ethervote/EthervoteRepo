App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/DPWCCWKE4HS53tNE7xFo");
      web3 = new Web3(App.web3Provider);
      notConnectedDialog.showModal();
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Ethervote.json", function(ethervote) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Ethervote = TruffleContract(ethervote);
      // Connect provider to interact with contract
      App.contracts.Ethervote.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Ethervote.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      /*
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });*/
    });
  },

  render: function() {
    var ethervoteInstance;

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("<p>Connected with " + account.slice(0,5) + "..." + account.slice(account.length-3,account.length) + "</p>");

      }
    });

    // Load contract data
    App.contracts.Ethervote.deployed().then(function(instance) {
      ethervoteInstance = instance;

      return ethervoteInstance.leftSharePrice();
    }).then(function(leftSharePrice) {
      lsp = Number(web3.fromWei(leftSharePrice.toNumber(), "ether" ));
      $("#leftVotePrice").html("Price: " + lsp);
      return ethervoteInstance.rightSharePrice();
    }).then(function(rightSharePrice){
      rsp = Number(web3.fromWei(rightSharePrice.toNumber(), "ether" ));
      $("#rightVotePrice").html("Price: " + rsp);
      return ethervoteInstance.leftVotes();
    }).then(function(leftVotes){
      $("#leftVotesCasted").html("Votes casted: " + leftVotes);
      lv = leftVotes.toNumber();
      return ethervoteInstance.rightVotes();
    }).then(function(rightVotes){
      $("#rightVotesCasted").html("Votes casted: " + rightVotes);
      rv = rightVotes.toNumber();
      return ethervoteInstance.leftSharePriceRateOfIncrease();
      /*
      return ethervoteInstance.viewMyShares(true);
    }).then(function(yourLeftVotes){
      $("#yourLeftVotesCasted").html("Your votes: " + yourLeftVotes);
      return ethervoteInstance.viewMyShares(false);
    }).then(function(yourRightVotes){
      $("#yourRightVotesCasted").html("Your votes: " + yourRightVotes);
      return ethervoteInstance.leftSharePriceRateOfIncrease();
      */
    }).then(function(leftSharePriceRateOfIncrease){
      lsproi = Number(web3.fromWei(leftSharePriceRateOfIncrease.toNumber(), "ether" ));
      return ethervoteInstance.rightSharePriceRateOfIncrease();
    }).then(function(rightSharePriceRateOfIncrease){
      rsproi = Number(web3.fromWei(rightSharePriceRateOfIncrease.toNumber(), "ether" ));
      return ethervoteInstance.thePot();
    }).then(function(thePot){
      $("#potValue").html(thePot / 1000000000000000000);
      return ethervoteInstance.expiryBlock();
    }).then(function(_expiryBlock){
      expiryBlock = _expiryBlock.toNumber();

      web3.eth.getBlockNumber(function(error, _blockNum){
        blockNum = _blockNum;
        var distance = (expiryBlock - blockNum) * 15000
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        $("#blockCounter").html("<span style='color:white; font-size: 14pt; font-weight: 400;'>Contract ends in: <br>" + days + " days, " + hours + " hours, " + minutes + " minutes</span><br> ( Expiry Block: " + expiryBlock+" )");
      })
      return ethervoteInstance.betIsSettled();
    }).then(function(betIsSettled){
        if(expiryBlock <= blockNum){console.log(betIsSettled);
          if(!betIsSettled){
            $("#blockCounter").html("<button onclick='App.settleBet();return(false);'>Resolve Contract</button><br><p>NOTE: Don't click this if you don't know what you're doing, you'll just waste gas.</p>");
          }else{
            $("#blockCounter").html("<span style='color:white; font-size: 14pt; font-weight: 400;'>This voting period has finished and the rewards have been sent out.<br>Tune in soon for another bet!</span>");
          }
        }
      }).catch(function(error) {
      console.warn(error);
      //alert(error);
      notConnectedDialog.showModal();
    });


    
    

  },

  castVote: function(votingForLeft) {/*
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Ethervote.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
    }).catch(function(err) {
      console.error(err);
    });*/
	
	App.contracts.Ethervote.deployed().then(function(instance) {
      buyDialog.close();
      transactionOutboundDialog.showModal();
      return instance.bet(votingForLeft, { from: App.account, value: web3.toWei($("#etherCostDialog").html(),"ether")});
    }).then(function(result) {
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];

      }
      // Wait for votes to update
      document.getElementById('buyDialog').close();
      transactionOutboundDialog.close();
      transactionSentDialog.showModal();
      App.render();
    }).catch(function(err) {
      //alert('failed vote');
      console.error(err);
    });
	
	
  },

  settleBet: function(){
    App.contracts.Ethervote.deployed().then(function(instance) {
      return instance.settleBet();
    });
  }
};
/*
$(function() {
  $(window).load(function() {
    App.init();
  });
});
*/
App.init();