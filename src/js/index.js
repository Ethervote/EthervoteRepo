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

/*
var dominanceCtx = document.getElementById('dominanceChart').getContext('2d');
var myPieChart = new Chart(dominanceCtx,{
    type: 'pie',
    data: data = {
    datasets: [{
        data: [10, 20]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Batman',
        'Superman',
    ]
},
    options: {}
});
*/

});

window.addEventListener("resize", function(){$('#Logo').css('paddingLeft', (window.innerWidth / 13.3) +'px');});
window.addEventListener("resize", function(){$('#mainDiv').css('width', window.innerWidth * 0.9 +'px');});
window.addEventListener("resize", function(){$('#accountAddress').css('paddingRight', (window.innerWidth / 13.3) + 5 + 'px');});


