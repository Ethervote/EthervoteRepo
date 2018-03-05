pragma solidity ^0.4.11;

contract Ethervote {
    
    address owner;
    
    address[] playerAddresses;
    
    uint expiryBlock;
    
    uint public leftSharePrice = 10 finney;
    uint public rightSharePrice = 10 finney;
    
    uint public leftSharePriceRateOfIncrease = 1 finney;
    uint public rightSharePriceRateOfIncrease = 1 finney;
    
    uint public leftVotes = 0;
    uint public rightVotes = 0;
    
    uint public thePot = 0 wei;
    
    struct Player {
        uint leftShares;
        uint rightShares;
        uint excessEther;
        bool hasBetBefore;
    }
    
    mapping(address => Player) players;
    
    modifier isOwner {
       if (msg.sender != owner) revert();
        _;
    }
    
    
    
    function Ethervote() public {
        expiryBlock = block.number + 150;
        owner = msg.sender;
    }
    
    function bet(bool bettingLeft) public payable {
        
        require(block.number < expiryBlock);
        
        if(!players[msg.sender].hasBetBefore){
            playerAddresses.push(msg.sender);
            players[msg.sender].hasBetBefore = true;
        }
            
            uint amountSent = msg.value;
            
            if(bettingLeft){
                require(amountSent >= leftSharePrice);
                
                while(amountSent >= leftSharePrice){
                    players[msg.sender].leftShares++;
                    leftVotes++;
                    thePot += leftSharePrice;
                    amountSent -= leftSharePrice;
                    
                    if((leftVotes % 15) == 0){//if the number of left votes is a multiple of 15
                        leftSharePrice += leftSharePriceRateOfIncrease;
                        if(leftVotes <= 45){//increase the rate at first, then decrease it to zero.
                            leftSharePriceRateOfIncrease += 1 finney;
                        }else if(leftVotes > 45){
                            if(leftSharePriceRateOfIncrease > 1 finney){
                                leftSharePriceRateOfIncrease -= 1 finney;
                            }else if(leftSharePriceRateOfIncrease <= 1 finney){
                                leftSharePriceRateOfIncrease = 0 finney;
                            }
                        }
                    }
                    
                }
                if(amountSent > 0){
                    players[msg.sender].excessEther += amountSent;
                }
                
            }
            else{//betting for the right option
                require(amountSent >= rightSharePrice);
                
                while(amountSent >= rightSharePrice){
                    players[msg.sender].rightShares++;
                    rightVotes++;
                    thePot += rightSharePrice;
                    amountSent -= rightSharePrice;
                    
                    if((rightVotes % 15) == 0){//if the number of right votes is a multiple of 15
                        rightSharePrice += rightSharePriceRateOfIncrease;
                        if(rightVotes <= 45){//increase the rate at first, then decrease it to zero.
                            rightSharePriceRateOfIncrease += 1 finney;
                        }else if(rightVotes > 45){
                            if(rightSharePriceRateOfIncrease > 1 finney){
                                rightSharePriceRateOfIncrease -= 1 finney;
                            }else if(rightSharePriceRateOfIncrease <= 1 finney){
                                rightSharePriceRateOfIncrease = 0 finney;
                            }
                        }
                    }
                    
                }
                if(amountSent > 0){
                    if(msg.sender.send(amountSent) == false)players[msg.sender].excessEther += amountSent;
                }
            }
    }
    
    
    function settleBet() public isOwner {
        require(block.number >= expiryBlock);
        
        uint winReward = thePot * 3;
        winReward = winReward / 20;
        if(owner.send(winReward) == false) players[owner].excessEther = winReward;
        winReward = thePot * 17;
        winReward = winReward / 20;
        
        if(leftVotes > rightVotes){
            winReward = winReward / leftVotes;
            for(uint i=0;i<playerAddresses.length;i++){
                if(players[playerAddresses[i]].leftShares > 0){
                    if(playerAddresses[i].send(players[playerAddresses[i]].leftShares * winReward) == false){
                        //if the send fails
                        players[playerAddresses[i]].excessEther = players[playerAddresses[i]].leftShares * winReward;
                    }
                }
            }
        }else if(rightVotes > leftVotes){
            winReward = winReward / rightVotes;
            for(uint u=0;u<playerAddresses.length;u++){
                if(players[playerAddresses[u]].rightShares > 0){
                    if(playerAddresses[u].send(players[playerAddresses[u]].rightShares * winReward) == false){
                        //if the send fails
                        players[playerAddresses[u]].excessEther = players[playerAddresses[u]].rightShares * winReward;
                    }
                }
            }
        }//make a tie breaker
    }
    
    
    function retrieveExcessEther() public {
        assert(players[msg.sender].excessEther > 0);
        if(msg.sender.send(players[msg.sender].excessEther)){
            players[msg.sender].excessEther = 0;
        }
    }
    
    function viewMyExcessEther() public view returns(uint){
        return players[msg.sender].excessEther;
    }
    
    function viewBlockNumber() public view returns(uint){
        return block.number;
    }
    
    function viewMyShares(bool left) public view returns(uint){
        if(left)return players[msg.sender].leftShares;
        return players[msg.sender].rightShares;
    }
}