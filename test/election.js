var Ethervote = artifacts.require("./Ethervote.sol");

contract("Ethervote", function(accounts) {

	it("initializes with two candidates", function(){
		return Ethervote.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count,2);
		});
	});

	it("allows a voter to cast a vote", function(){
		return Ethervote.deployed().then(function(instance) {
			ethervoteInstance = instance;
			candidateId = 1;
			return ethervoteInstance.vote(candidateId, {from: accounts[0]});
		}).then(function(receipt) {
			return ethervoteInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted,"the voter was marked as voted");
			return ethervoteInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increments the candidate's vote count");
		})
	})
});