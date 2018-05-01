var modalVotingLeft = false,
lsp = 0.01,
rsp = 0.01,
lsproi = 0.001,
rsproi = 0.001,
lv = 0,
rv = 0,
blockNum = 0,
expiryBlock = 0,
betIsSettled,
yourRightVotes = 0,
yourLeftVotes = 0;


$(function() {
	$('#Logo').css('paddingLeft', (window.innerWidth / 13.3) +'px');
	$('#mainDiv').css('width', window.innerWidth * 0.9 +'px');
	$('#accountAddress').css('paddingRight', (window.innerWidth / 13.3) + 5 + 'px');
	
	var graphPoint = new Image();
	graphPoint.src = "./images/graphpoint.png";
	
var priceCtx = document.getElementById('priceChart').getContext('2d');
var chart = new Chart(priceCtx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [0,15,30,45,60,75,90,105,"120+"],
		xAxisID: "Votes",
        datasets: [{
            label: "ETH Price per share (Y) / Votes casted (X)",
			steppedLine: true,
            //backgroundColor: 'rgb(255, 99, 132)',
            borderColor: '#e1bb34',
			pointStyle: graphPoint,
			hitRadius: 25,
			pointRadius: 5,
            data: [{
					x: 0,
					y: 0.01
				}, {
					x: 15,
					y: 0.011
				}, {
					x: 30,
					y: 0.013
				}, {
					x: 45,
					y: 0.016
				}, {
					x: 60,
					y: 0.02
				}, {
					x: 75,
					y: 0.023
				}, {
					x: 90,
					y: 0.025
				}, {
					x: 105,
					y: 0.026
				}, {
					x: 120,
					y: 0.026
				}],
        }]
    },

    // Configuration options go here
    options: {}
});


var notConnectedDialog = document.querySelector('#notConnectedDialog');
dialogPolyfill.registerDialog(notConnectedDialog);

$(".fox").on("click", function(){
	notConnectedDialog.showModal();
})

$('#closeNotConnectedDialog').on('click', function() {
	notConnectedDialog.close();
});

var transactionSentDialog = document.querySelector('#transactionSentDialog');
dialogPolyfill.registerDialog(transactionSentDialog);


$('#closeTransactionSentDialog').on('click', function() {
	transactionSentDialog.close();
});

var transactionOutboundDialog = document.querySelector('#transactionOutboundDialog');
dialogPolyfill.registerDialog(transactionOutboundDialog);


$('#closetransactionOutboundDialog').on('click', function() {
	transactionOutboundDialog.close();
});

var buyDialog = document.querySelector('#buyDialog');
dialogPolyfill.registerDialog(buyDialog);

function openBuyModal(){
    buyDialog.showModal();
    modalVotingLeft ? $('#buyDialogVotesDesired').html('Batman Votes Desired:') : $('#buyDialogVotesDesired').html('Superman Votes Desired:');
}

$('.buyButton').on('click', function () {
	openBuyModal();
});

$('.gallery img').on('click', function () {
	openBuyModal();
});

$('#cancelDialog').on('click', function() {
	buyDialog.close();
});

$("#buyDialogConfirmButton").css("backgroundColor", "#CCA033");
$("#buyDialogConfirmButton:hover").css("backgroundColor", "#DDA727");

$("#votesDesiredInput").bind('input', function() {

	var voteNum = document.getElementById("votesDesiredInput").value;

	if(isNaN(voteNum) || voteNum <= 0){
			$("#etherCostDialog").html("0");
			$("#buyDialogConfirmButton").click(function(){});//deactivate buy button
			$("#buyDialogConfirmButton").css("backgroundColor", "#CCA033");
			$("#buyDialogConfirmButton:hover").css("backgroundColor", "#DDA727");
		} else if(voteNum >100000){
			$("#etherCostDialog").html("Too many votes!");
			$("#buyDialogConfirmButton").click(function(){});
			$("#buyDialogConfirmButton").css("backgroundColor", "#CCA033");
			$("#buyDialogConfirmButton:hover").css("backgroundColor", "#DDA727");
		} else {

			var totalEthPrice = 0,
			plsp = lsp,//projected left share price
			plsproi = lsproi,
			plv = lv,
			prsp = rsp,
			prsproi = rsproi,
			prv = rv;
			
			if(modalVotingLeft){
				for(var i=0;i<voteNum;i++){
					totalEthPrice += plsp;
					plv++;

					if(plv % 15 == 0){
						plsp += plsproi;
						if(plv <= 45){
							plsproi += 0.001;
						}else if(plv > 45){
							if(plsproi > 0.001){
                                plsproi -= 0.001;
                            }else if(plsproi <= 0.001){
                                plsproi = 0;
                            }
						}
					}
				}
			}else if(!modalVotingLeft){
				for(var i=0;i<voteNum;i++){
					totalEthPrice += prsp;
					prv++;

					if(prv % 15 == 0){
						prsp += prsproi;
						if(prv <= 45){
							prsproi += 0.001;
						}else if(prv > 45){
							if(prsproi > 0.001){
                                prsproi -= 0.001;
                            }else if(prsproi <= 0.001){
                                prsproi = 0;
                            }
						}
					}
				}
			}

			$("#etherCostDialog").html(Math.round(totalEthPrice * 1000)/1000);

			$("#buyDialogConfirmButton").click(function(){
					App.castVote(modalVotingLeft);
			});
			$("#buyDialogConfirmButton").css("backgroundColor", "#FFBC05");
			$("#buyDialogConfirmButton:hover").css("backgroundColor", "#FFC710");
		}

});


});

window.addEventListener("resize", function(){$('#Logo').css('paddingLeft', (window.innerWidth / 13.3) +'px');});
window.addEventListener("resize", function(){$('#mainDiv').css('width', window.innerWidth * 0.9 +'px');});
window.addEventListener("resize", function(){$('#accountAddress').css('paddingRight', (window.innerWidth / 13.3) + 5 + 'px');});


