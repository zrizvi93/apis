function getOffsetValues() {
  
  // open Spreadsheet
  var ss = SpreadsheetApp.openById("1_43ubesnIKNAB6zI7CaNkqfqIjKEse4biYaQrwHMv2U"); // the spreadsheet ID to write to
  var sheetData = ss.getSheetByName('Hubspot Cursor-Paginated Datasource Offset Values');
  
  
  // API CALL. We May Not Need "fileName" in final script
  var apiKey="";// account API key
  var fileName='Hubspot Cursor-Paginated Datasource Offset Values';//The actual filename of the existing file, in your Google Drive
  
  // getting the size of the contact list
  var url2="https://api.hubapi.com/contacts/v1/lists/927?hapikey="+apiKey;
  var response2 = UrlFetchApp.fetch(url2);
  var text2=response2.getContentText();
  // extracting size from the content text, dividing by 20 (google imposes size quotas)
  var size=text2.substring(text2.indexOf('size":')+6,text2.indexOf('},"authorId'))/20;
  var max=Math.ceil(size).toFixed();
  

  //Run query once, to see if there are more pages, and to get offset value if so
  var url = "https://api.hubapi.com/contacts/v1/lists/927/contacts/all?count=20&hapikey="+apiKey;
  
  var options = {"async": true,
                 "crossDomain": true,
                 "method" : "GET",
                 'muteHttpExceptions': true,
                 "headers" : {"Authorization":"Bearer APIKEYHERE"}
                };   
  
  var response = UrlFetchApp.fetch(url);
  
  //Get specific info from response
  var text=response.getContentText();//Get full query response
  
  //Start at offset=0 (first page)
  var offset=0; 
  
  //Find out if there are more pages
  var hasMore=text.substring(text.indexOf('"has-more":')+11,text.indexOf(',',text.indexOf('"has-more":')));
  var iteration=0;//start at 0th iteration


  var startText='{  "vid-offsets": [';//Text at start of file. This will be specific to the service and API query used
  var endText=']}';//Text at the end of file. This will be specific to the service and API query used
  var fileText=startText;//File contents, to append data to
  
  // Retrieve values to a multi-dimensional array
  var value=[];
  var values=[];
  
  while( iteration<max && hasMore) 
  
  {  
   url = "https://api.hubapi.com/contacts/v1/lists/927/contacts/all?hapikey="+apiKey+"&vidOffset="+offset;
   response = UrlFetchApp.fetch(url);
   text=response.getContentText();
    
   offset=text.substring(text.indexOf('vid-offset')+12).slice(0,-1);
   hasMore=text.substring(text.indexOf('"has-more":')+11,text.indexOf(',',text.indexOf('"has-more":')));
   
   //Logger.log(offset);

    
    var content=text.substring(text.indexOf('[')+1, text.lastIndexOf(']'));
    
    if(iteration==0){ 
    //Logger.log(offset);
    }else{}
    value=offset;
    //fileText+=offset+",";
    iteration++;
    values.push(value);
  }
  
  Logger.log(values);
  
}
  
 




