/*
Copyright (c) 2009, Henrik Joreteg
All rights reserved.

jQuery Magic Labels v0.6.1

Released under the BSD license, read it here:
http://projects.joreteg.com/licenses/BSD.html
*/
$(function(){
	var table = "table#tz ";
	
	
	// accessors AND mutators for cells
	function getColumnCells(colNumber){
		return $(table + "tr td:nth-child(" + colNumber + ")");
	}
	
	function getRowCells(rowNumber){
		var row = rowNumber - 1;
		return $(table + "tr:eq(" + row + ") td");
	}
	
	function getCell(x,y){
		return getRowCells(y).eq(x-1);
	}
	
	function getCellValue(x,y){
		var cell = getRowCells(y).eq(x-1);
		if(cell.html() == '&nbsp;'){
			return 0;
		}
		else {
			return Number(cell.html());
		}
	}

	function setCellValue(x,y,amount){
		getCell(x,y).html(amount);
		return true;
	}
	
	$('#clearAll').click(function(){
		var numberOfColumns = Number($(table + "tr:first td:last").attr("id"));
		var i = 0;
		
		// clear cells
		$(table + ".setMe").html("&nbsp;");
		
		// recalculate totals for all columns
		for(i=1; i <= numberOfColumns; i++){
			calculateTotals(i);
		}
		
		return true;
	});
	
	
	// makes cells unwritable, this is called when new columns are created.
	function makeUnwritable(playerNumber){
		var colNumber = playerNumber - 1;
		
		getColumnCells(column).slice(7,10).removeClass("setMe").css("background","#EEE");
		
		getColumnCells(column).slice(17,19).removeClass("setMe").css("background","#EEE");
	}
	
	// numbers columns so I can delete, etc.
	function renumberColumns(){
		$(table + "tr:first td").each(function(i){
			$(this).attr("id", i+1);	
		});
	}
	
	
	// add additional player
	$("#addPlayerForm").submit(function(){
		var playerName = $("#playerName").val();
		var playerNumber = $(table + "tr:first td").length;
		
		// make sure they entered something
		if(playerName == ''){
			alert("You must enter a player name");
			return false;
		}
		// if they did, append the name and create delete link
		else {
			$(table + "tr:first").append('<td><span class="name">' + playerName + '</span> <a href="#" class="delPlayer">delete</a></td>');
			$("#playerName").val('');
			renumberColumns();
		}
		
		// append empty cells
		$(table + "tr").each(function(i){
			if(i != 19 && i != 0){
				$(this).append('<td class="setMe">&nbsp;</td>');	
			}
		});
		
		calculateTotals(playerNumber);
		makeUnwritable(playerNumber);
		
		return false;
	});
	
	
	// remove player, this has to be a 'live' selector for this to work
	// since these are added dynamically
	$("a.delPlayer").live("click", function(){
		var playerNumber = Number($(this).parent().attr("id"));
		var playerName = $(this).parent().find(".name").html();
		
		if(confirm("Are you sure you want to delete \"" + playerName + "\"?")){
			getColumnCells(playerNumber).remove();
		}
	});
	
	
	// calculate and write totals for a given player number
	function calculateTotals(playerNumber){
		column = playerNumber + 1;
		topHalfCells = getColumnCells(column).slice(1,7);
		topHalfSubTotal = 0;
		topHalfTotal = 0;
		bonus = 0;
		bottomHalfCells = getColumnCells(column).slice(10,17);
		bottomHalfTotal = 0;
		grandTotal = 0;
		
		// calculate top half sub total
		topHalfCells.each(function(){
			if($(this).html() != '&nbsp;'){
				topHalfSubTotal = topHalfSubTotal + Number($(this).html());	
			}
		});
		
		// if bonus earned, add bonus
		if(topHalfSubTotal >= 63){
			bonus = 35;
		}
		
		// top half total
		topHalfTotal = topHalfSubTotal + bonus;
		
		// calculate bottom half total
		bottomHalfCells.each(function(){
			if($(this).html() != '&nbsp;'){
				bottomHalfTotal = bottomHalfTotal + Number($(this).html());	
			}
		});
		
		// calculate grand total
		grandTotal = topHalfTotal + bottomHalfTotal; 
		
		// write totals
		setCellValue(column,8, topHalfSubTotal);
		setCellValue(column,9, bonus);
		setCellValue(column,10, topHalfTotal);
		setCellValue(column,18, bottomHalfTotal);
		setCellValue(column,19, grandTotal);
	}
	
	
	// register click events for scorekeeping
	$(".setMe").live("click", function(){
		var options = $(this).parent().attr("title");
		var optionsArray = options.split(" ");
		var currentVal = $(this).html();
		var nextVal = 0;
		var i = 0;
		var currentPosition = 0;
		var nextPosition = 0;
		var colNumber = $(this).prevAll().length;
		
		optionsArray.unshift("0");
		optionsArray.unshift("&nbsp;");
		
		for(i = 1; i <= optionsArray.length; i++){
			if(currentVal == optionsArray[i]){
				currentPosition = i;
				break;
			}
		}
		
		if(currentPosition == optionsArray.length - 1){
			nextPosition = 0;
		}
		else{
			nextPosition = currentPosition + 1;
		}
		
		$(this).html(optionsArray[nextPosition]);
		
		calculateTotals(colNumber);
		
		return true;
	});
});