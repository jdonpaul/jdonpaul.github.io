
var angularApp = angular.module('Fringecovery', []);

angularApp.controller('MainController', [ '$scope', function($scope) {

  $scope.rows = [];	  
  $scope.counter = 1;
  
  angular.element(document).ready( function(){

  });
  
  //
  // add a new row to the Troubleshooting table.
  $scope.addRow = function() {
	var d = new Date();
	var newDate = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
    $scope.rows.push({ 'ID':"", 'Date':newDate , 'Entry':"", 'NextSteps':"" });
    $scope.counter++;
  }

  //
  // Function to clean all the data from the document.
  $scope.CleanDocument = function ()
  {  
    document.getElementById('PROBSTATMNT').value = "";
    
    document.getElementById('WHATOBJIS').innerText = "";
    document.getElementById('WHATOBJISNOT').innerText = "";
    document.getElementById('WHATOBJDEVIS').innerText = "";
    document.getElementById('WHATOBJDEVISNOT').innerText = "";
    document.getElementById('WHERELOCIS').innerText = "";
    document.getElementById('WHERELOCISNOT').innerText = "";
    document.getElementById('WHEREONOBJIS').innerText = "";
    document.getElementById('WHEREONOBJISNOT').innerText = "";
    document.getElementById('WHENFIRST').innerText = "";
    document.getElementById('WHENFIRSTNOT').innerText = "";
    document.getElementById('WHENPATTERN').innerText = "";
    document.getElementById('WHENPATTERNNOT').innerText = "";
    document.getElementById('WHENLIFECYCLE').innerText = "";
    document.getElementById('WHENLIFECYCLENOT').innerText = "";
    document.getElementById('EXTNUMBEROBJ').innerText = "";
    document.getElementById('EXTNUMBEROBJNOT').innerText = "";
    document.getElementById('EXTDEVSIZE').innerText = "";
    document.getElementById('EXTDEVSIZENOT').innerText = "";
  
    var myTable = document.getElementById('TSTABLE');  	  
    var rowCount = myTable.rows.length;
    for (var rowIndex=rowCount-1; rowIndex>0; rowIndex--) {
      myTable.deleteRow(rowIndex)
    }
	  
	  $scope.rows = [];	  
	  $scope.counter = 1;
    
    document.getElementById('POSSIBLECAUSE').value = "";  
	  document.getElementById('TRUECAUSE').value = "";
  }  
  
  //
  // Delete row from Troushooting table.
  $scope.minusRow = function(index) {
    // remove the row specified in index
    $scope.rows.splice( index, 1);
	// if no rows left in the array create a blank array
	if ($scope.rows.length === 0){
	  $scope.rows = [];
	}	
  }
  
  //
  // override paste key stroke
  $scope.paste = function(e){
    var pastedData = null;
	  
    if( e.originalEvent.clipboardData ){
    	pastedData = (e.originalEvent || e).clipboardData.getData('text/plain');
      }
    else if( window.clipboardData ){
    	pastedData = window.clipboardData.getData('Text');
      }
	  
	  // check to see if the element is editable. If it is, let the paste action
    // follow it's course. Other wise, get pasted data and parse it into the web page.
	  if(e.target.isContentEditable == false){
		  $scope.PasteForm(pastedData);
		  return false;
	  }
   }
  
  //
  // Override copy key stroke
  $scope.copy = function(e){	  
	  
	  // check to see if the element is editable
	  if(e.target.isContentEditable == false){		
         var data = $scope.CopyForm();
         document.getElementById('CopyArea').innerHTML = data;
         document.getElementById('CopyArea').focus();
         document.getElementById('CopyArea').select();
	  }
   } 

   $scope.CopyButton = function(){

   }
   
   $scope.PasteButton = function(){
   
   }
   
  
  //
  // Function to load data into the document
  $scope.PasteForm = function(data){
	  var _start;
	  var _end;
	  
	  // clean the document before pasting data.
	  $scope.CleanDocument();
	  
	  _start = data.indexOf("1. Problem Specification //Problem Statement//:");
	  _end = data.indexOf("WHAT:");
	  if(_start != -1 && _end != -1){
	    var psString = data.substring(_start, _end).split("\r\n");
		psString.splice(psString.length-1, 1);
		psString.splice(0, 1);	  
		if(psString.length > 0){
		  var ele = document.getElementById('PROBSTATMNT');
		  psString.forEach(function(entry) {
			  ele.value += entry + "\n";
		  });
		  ele.value = $scope.TrimNewLine(ele.value);
		}
      }
	  
	  //Parse and format Problem Statement
	  _start = data.indexOf("WHAT:");
	  _end = data.indexOf("2. Possible Cause //Possible Cause//:");
	  if(_start != -1 && _end != -1){
      var psString = data.substring(_start,_end).split("\r\n");
      //psString.splice(0, 2) ;
      $scope.parsePS(psString);
      }

     //Parse and format Expected Results
	  _start = data.indexOf("2. Possible Cause //Possible Cause//:");
	  _end = data.indexOf("3. Troubleshooting //Current Status and Next Steps//:");
	  if(_start != -1 && _end != -1){
      var tString = data.substring(_start,_end).split("\r\n");
      tString.splice(0, 1)
      document.getElementById('POSSIBLECAUSE').value = tString;  
	  }
	   
	  //Parse and format Expected Results
	  _start = data.indexOf("3. Troubleshooting //Current Status and Next Steps//:");
	  _end = data.indexOf("4. True Cause //Solution Provided// //Ticket Resolution//:");
	  if(_start != -1 && _end != -1){
      var tString = data.substring(_start,_end).split("\r\n");
      tString.splice(0, 1)
      if(tString.length > 0){		  
        $scope.parseTS(tString);
      }
	  }
	    
	  _start = data.indexOf("4. True Cause //Solution Provided// //Ticket Resolution//:");
	  if(_start != -1){
  	  var tcString = data.substring(_start).split("\r\n");
      tcString.splice(tcString.length-1, 1);
      tcString.splice(0, 1);	  
      if(tcString.length > 0){
		  var ele = document.getElementById('TRUECAUSE');
		  tcString.forEach(function(entry) {
			  ele.value += entry + "\n";
		  });
		  ele.value = $scope.TrimNewLine(ele.value);
		}
      }	  
  }
  
  //
  // Function for saving the data to a string
  $scope.CopyForm = function(){

    	var TSTableArray = [];
    	$("table#TSTABLE tr").each(function() {
    	    var arrayOfThisRow = [];
    	    var tableData = $(this).find('td');
    	    if (tableData.length > 0) {
    	        tableData.each(function() { 
    	        	arrayOfThisRow.push(this.innerText); 
    	        });
    	        TSTableArray.push(arrayOfThisRow);
    	    }
    	});    	
    	
    	/*
    	Format for output
    	Format wanted:
        ================================================
        1. Problem Specification //Problem Statement//:


        WHAT:
          Object:
          NOT:

          Deviation:
          NOT: 

        WHERE:
          Location(Geographically): 
          NOT: 

          On Object: 
          NOT:
          
        WHEN:
          First:  
          NOT: 
          
          Since + pattern: 
          NOT: 
          
          When in Lifecycle: 
          NOT: 


        EXTENT:
          Number of objects + Trend:
          NOT: 

          Deviation Size + Trend: 
          NOT: 

        2. Possible Cause //Possible Cause//:

          
        3. Troubleshooting //Current Status and Next Steps//:



        4. True Cause //Solution Provided// //Ticket Resolution//:

    	*/   	
    	
    	var outputFile = "";
    	
    	outputFile += "================================================\r\n";   	
		
		  // Process Problem Statement
		  outputFile += "1. Problem Specification //Problem Statement//:\r\n";
		  outputFile += document.getElementById('PROBSTATMNT').value;
      outputFile += "\r\n";
      
      outputFile += "\r\nWHAT:\r\n";
      outputFile += "Object:\r\n";
      outputFile += document.getElementById('WHATOBJIS').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHATOBJISNOT').innerText;

      outputFile += "Deviation:\r\n";
      outputFile += document.getElementById('WHATOBJDEVIS').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHATOBJDEVISNOT').innerText;

      outputFile += "\r\nWHERE:\r\n";
      outputFile += "Location(Geographically):\r\n";
      outputFile += document.getElementById('WHERELOCIS').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHERELOCISNOT').innerText;

      outputFile += "On Object:\r\n";
      outputFile += document.getElementById('WHEREONOBJIS').innerText;
      outputFile += "NOT:" + "\r\n";
      outputFile += document.getElementById('WHEREONOBJISNOT').innerText;

      outputFile += "\r\nWHEN:\r\n";
      outputFile += "First:\r\n";
      outputFile += document.getElementById('WHENFIRST').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHENFIRSTNOT').innerText;

      outputFile += "Since + pattern:\r\n";      
      outputFile += document.getElementById('WHENPATTERN').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHENPATTERNNOT').innerText;

      outputFile += "When in Lifecycle:\r\n";
      outputFile += document.getElementById('WHENLIFECYCLE').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('WHENLIFECYCLENOT').innerText;

      outputFile += "\r\nEXTENT:\r\n";
      outputFile += "Number of objects + Trend:" + "\r\n";
      outputFile += document.getElementById('EXTNUMBEROBJ').innerText;
      outputFile += "NOT:\r\n";
      outputFile += document.getElementById('EXTNUMBEROBJNOT').innerText;

      outputFile += "Deviation Size + Trend:" + "\r\n";
      outputFile += document.getElementById('EXTDEVSIZE').innerText;
      outputFile += "NOT:" + "\r\n";
      outputFile += document.getElementById('EXTDEVSIZENOT').innerText;

      
    	// Process Possible Cause
    	outputFile += "\r\n2. Possible Cause //Possible Cause//:\r\n";
     	test = document.getElementById('POSSIBLECAUSE').value;
     	outputFile += test.replace("\n","\r\n");
    	outputFile += "\r\n";         
		
    	// process Troubleshooting
    	outputFile += "\r\n3. Troubleshooting //Current Status and Next Steps//:\r\n";	
      if(TSTableArray.length != 0){		
     	  TSTableArray.forEach(function(entry) {
    	    if(entry[0] != ""){
    	   	  outputFile += ":" + entry[1] + "\r\n";
  			    outputFile += entry[2];
			      outputFile += "\r\n:Next Steps\r\n" + entry[3] + "\r\n";
    	    }
    	  });   
		  }
		  else {
		    outputFile += "\r\n";
		  }
		
    	// Process True Cause
    	outputFile += "\r\n4. True Cause //Solution Provided// //Ticket Resolution//:\r\n";
     	test = document.getElementById('TRUECAUSE').value;
     	outputFile += test.replace("\n","\r\n");
    	outputFile += "\r\n";    	
   	
      outputFile.replace(/<(?:.|\n)*?>/gm, '');
    	// save to clipboard
    	return(outputFile);
  }

  //
  // Function to parse function for Problem Specification.
  $scope.parsePS = function(psString){

    var idxWHAT = psString.indexOf("WHAT:");
    var idxWHERE = psString.indexOf("WHERE:");
    var idxWHEN = psString.indexOf("WHEN:");
    var idxEXTENT = psString.indexOf("EXTENT:");
    var idxRow;
    var element;
    var elementSection;
    
    //split from WHAT to WHERE
    var whatArray = psString.slice(idxWHAT+1,idxWHERE);
    //split from WHERE to WHEN
    var whereArray = psString.slice(idxWHERE+1,idxWHEN);    
    //Split from WHEN to EXTENT
    var whenArray = psString.slice(idxWHEN+1,idxEXTENT);
    // Split from EXTEXT to the end.
    var extentArray = psString.slice(idxEXTENT+1);
    
    // process WHAT
    for(idxRow = 0; idxRow < whatArray.length; idxRow++){    
      switch(whatArray[idxRow]){
        case "Object:":
          elementSection = whatArray[idxRow];
          element = document.getElementById('WHATOBJIS');
          break;
        case "Deviation:":
          elementSection = whatArray[idxRow];
          element = document.getElementById('WHATOBJDEVIS');
          break

        case "NOT:":
          if(elementSection == "Object:"){
            element = document.getElementById('WHATOBJISNOT');
          } else {
            element = document.getElementById('WHATOBJDEVISNOT');
          }
          break;
        default:
          element.innerText += whatArray[idxRow];
          break;
      }
    }

    
    // process WHERE
    for(idxRow = 0; idxRow < whereArray.length; idxRow++){    
      switch(whereArray[idxRow]){
        case "Location(Geographically):":
          elementSection = whereArray[idxRow];
          element = document.getElementById('WHERELOCIS');
          break;
        case "On Object:":
          elementSection = whereArray[idxRow];
          element = document.getElementById('WHEREONOBJIS');
          break;
        case "NOT:":
          if(elementSection == "Location(Geographically):"){
            element = document.getElementById('WHERELOCISNOT');
          } else {
            element = document.getElementById('WHEREONOBJISNOT');
          }
          break;
        default:
          element.innerText += whereArray[idxRow];
          break;
      }
    }    
    
    // process WHEN
    for(idxRow = 0; idxRow < whenArray.length; idxRow++){    
      switch(whenArray[idxRow]){
        case "First:":
          elementSection = whenArray[idxRow];
          element = document.getElementById('WHENFIRST');
          break;
        case "Since + pattern:":
          elementSection = whenArray[idxRow];
          element = document.getElementById('WHENPATTERN');
          break;
       case "When in Lifecycle:":
          elementSection = whenArray[idxRow];
          element = document.getElementById('WHENLIFECYCLE');
          break;          
        case "NOT:":
          if(elementSection == "First:"){
            element = document.getElementById('WHENFIRSTNOT');
          } else if (elementSection == "Since + pattern:") {
            element = document.getElementById('WHENPATTERNNOT');
          } else {
            element = document.getElementById('WHENLIFECYCLENOT');
          }
          break;
        default:
          element.innerText += whenArray[idxRow];
          break;
      }
    }     
   
    // process EXTENT
    for(idxRow = 0; idxRow < extentArray.length; idxRow++){    
      switch(extentArray[idxRow]){
        case "Number of objects + Trend:":
          elementSection = extentArray[idxRow];
          element = document.getElementById('EXTNUMBEROBJ');
          break;
        case "Deviation Size + Trend:":
          elementSection = extentArray[idxRow];
          element = document.getElementById('EXTDEVSIZE');
          break;
        case "NOT:":
          if(elementSection == "Number of objects + Trend:"){
            element = document.getElementById('EXTNUMBEROBJNOT');
          } else {
            element = document.getElementById('EXTDEVSIZENOT');
          }
          break;
        default:
          element.innerText += extentArray[idxRow];
          break;
      }
    }     
  
  }
  
  //
  // Function to parse data for Troubleshooting section
  $scope.parseTS = function(tsString){
  	var myTable = document.getElementById('TSTABLE');  	  
	  var row = null;
	  var testNS = false;
	  
  	  // insert based on data
	  tsString.forEach(function(entry) {
		var NS_REGEX = /^:next step/i;
	    var DATE_REGEX = /^:(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	    var rowCount = myTable.rows.length;
		var testFirstColon = (entry.match(/^:/i) != null) ? true : false;
		var isDateEntry;
		
		if (testFirstColon){
			isDateEntry = (entry.match(DATE_REGEX) != null) ? true : false; // is the format ok?
			testNS = (entry.match(NS_REGEX) != null) ? true : false; // is the format ok?
		}
				
	    if ((!isDateEntry) ) {
          if(row != null){		
			if(!testFirstColon ){
			  if(testNS){
				row.cells[3].innerText += entry + "\r\n";
			  }
			  else{			    
				row.cells[2].innerText += entry + "\r\n";
			  }
			}		  
		  }
	    }
	    else {	
	      if(row != null){
	    	  row.cells[2].innerText = $scope.TrimNewLine(row.cells[2].innerText);
    	  }
	      row = myTable.insertRow(rowCount);
	      row.id="";
	      
	      var cell1 = row.insertCell(0);
	      var element1 = document.createElement("button");
	      element1.id = "MINUSTSTABLE";
	      element1.className = "btnminus";
	      element1.onclick = function () {
	    		  cell = this.parentNode;
	    		  row = cell.parentNode;
	    		  document.getElementById('TSTABLE').deleteRow(row.rowIndex);
	    	  };
	      cell1.appendChild(element1);
	     
	      var d = new Date();
	      row.insertCell(1);
	      row.cells[1].innerHTML = entry.replace(':','');
	      
	      row.insertCell(2);
	      row.cells[2].contentEditable = 'true';
		  
		  row.insertCell(3);
	      row.cells[3].contentEditable = 'true';
		  testNS = false;
	    }
	  });
  	  
      if(row != null){
    	  row.cells[2].innerText = $scope.TrimNewLine(row.cells[2].innerText);
	  }
  } 
  
  //
  // Function to trim the trailing newline in a string
  $scope.TrimNewLine = function(obj){
	  for(x = obj.length; obj[x-1] == "\n"; x-- ){
		  obj = obj.slice(0, -1);
	  } 
	  return obj;
  }  
  
  $scope.IsWebpageNew = function(){
     var documentDate = document.lastModified.getTime()
	 var todayDate = new Date()
	 
	 var difference = Date.daysBetween(documentDate,todayDate);
	 
	 console.log('days since last update ' + difference);
  }

  $scope.SendEmail = function()
  {
    var subject = "OTCS Ticket " + document.getElementById('TicketNum').value;
    var msg = $scope.CopyForm();

    //Create a object of Outlook.Application
    try
    {
      // this method only allow about 2K total in IE -- about 8K in Mozilla
      window.location.href = "mailto:support_bcc_priv@opentext.com?"      
                    + "subject=" + subject
                    + '&body=' + encodeURIComponent(msg);

    }
    catch(err)
    {
        document.getElementById('alert_placeholder').innerHTML = '<div id="alertdiv" class="alert alert-warning"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + err + '</div>';
        
        $("#alertdiv").fadeTo(3000, 0).slideUp(500, function(){
               $("#alertdiv").alert('close');
        });   
    }
  }  
  
  
}]);
