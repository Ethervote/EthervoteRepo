App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
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
      var leftVotesForChart = 0;

      return ethervoteInstance.leftSharePrice();
    }).then(function(leftSharePrice) {
      $("#leftVotePrice").html("Price: " + (leftSharePrice / 1000000000000000000));

      return ethervoteInstance.rightSharePrice();
    }).then(function(rightSharePrice){
      $("#rightVotePrice").html("Price: " + (rightSharePrice / 1000000000000000000));

      return ethervoteInstance.leftVotes();
    }).then(function(leftVotes){
      $("#leftVotesCasted").html("Votes casted: " + leftVotes);
      leftVotesForChart = leftVotes;

      return ethervoteInstance.rightVotes();
    }).then(function(rightVotes){
      $("#rightVotesCasted").html("Votes casted: " + rightVotes);

      var dominanceCtx = document.getElementById('dominanceChart').getContext('2d');
      var myPieChart = new Chart(dominanceCtx,{
          type: 'pie',
          data: {
            datasets: [{
                data: [1, 2],
                backgroundColor: ["#252D5C","#BD9028"]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Batman',
                'Superman',
            ],
          },
          options: {
            cutoutPercentage: 50

          }
        });

      return ethervoteInstance.thePot();
    }).then(function(thePot){
      $("#potValue").html(thePot / 1000000000000000000);
    }).catch(function(error) {
      console.warn(error);
      alert(error);
    });

    web3.eth.getBlockNumber(function(blockNum){
      $("#blockCounter").html("Current BBBlock: " + blockNum);
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
      return instance.bet(true, { from: App.account, value: 100000000000000000});
    }).then(function(result) {
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];

        console.log(log);
      }
      // Wait for votes to update
      alert('successful vote');
    }).catch(function(err) {
      alert('failed vote');
      console.error(err);
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