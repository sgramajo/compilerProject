var editor;
window.onload = function() {
    /* CodeMirror Elements Startup */
    editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
        lineNumbers: true,
        mode: "text/x-java",
        matchBrackets: true
    });
    
    /* File Reader API */
    var fileInput = document.getElementById('fileUpload');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var textArea = document.getElementById('demotext');
            editor.getDoc().setValue(reader.result);
        }
        reader.readAsText(file);	
    });

    /* Add Text */
    $("#addText").keydown(function(evt) {
		if(evt.keyCode == 13){
            alert($("#addText").val());
        }
    }); 
    
    /*Button Group */
    $("div.btn-group").on( 'click', '.dropdown-menu li', function( event ) {
      var $target = $( event.currentTarget );
      $target.closest( '.btn-group' )
         .find( '[data-bind="label"]' ).text( $target.text() )
            .end()
         .children( '.dropdown-toggle' ).dropdown( 'toggle' );

      return false;

   });
   restartConsole(); 

   /* Responsive Tabs - Bootstrap */
    $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
    var $target = $(e.target);
    var $tabs = $target.closest('.nav-tabs-responsive');
    var $current = $target.closest('li');
    var $parent = $current.closest('li.dropdown');
		$current = $parent.length > 0 ? $parent : $current;
    var $next = $current.next();
    var $prev = $current.prev();
    var updateDropdownMenu = function($el, position){
      $el
      	.find('.dropdown-menu')
        .removeClass('pull-xs-left pull-xs-center pull-xs-right')
      	.addClass( 'pull-xs-' + position );
    };

    $tabs.find('>li').removeClass('next prev');
    $prev.addClass('prev');
    $next.addClass('next');
    
    updateDropdownMenu( $prev, 'left' );
    updateDropdownMenu( $current, 'center' );
    updateDropdownMenu( $next, 'right' );
   });
}

function restartConsole(){
    /* Console Startup */
    $(consoleResults).empty(); 
}
/* New File */
function newFile(){
    editor.setValue("");
    editor.clearHistory(); 
    restartConsole(); 
    clearInnerHTML();
}
function goback(){
    editor.undo();
}
function redo(){
    editor.redo(); 
}
function trimLeadZero(s) {
    return (""+s).replace(/^0+/, "");
}

/* Load Tutorial */
function load_more(fileName) {
     document.getElementById("addTutorial").innerHTML='<object height="100%" width="100%" type="text/html" data="pages/' + fileName + '.html" ></object>';
}

/* Save File */
function saveFile(){
    var blob = new Blob([editor.getValue()], {type: "text/plain;charset=utf-8"}); 
	saveAs(blob, "compilerCode.txt");
}

var numberOfVariablesInStack;
/*Create Stack tab */
function createStack(){
    var ktemp = 0, numberOfVariablesInStack = 0, stackSentence = ""; 
    for(ktemp = 0; ktemp < code.length; ktemp++){
        stackSentence = stackReview(ktemp, code[ktemp].op, code[ktemp].l, code[ktemp].m, stackSentence); 
    }
    $("#stackPic").append(stackSentence); 
}

function stackReview(temp, nOP, nL, nM, sentence){
    var numberOfValues = 0; 
    switch(parseInt(nOP)){
        case 7:
            console.log("stackReview() case is 7"); 
            sentence = "</table></div>" + sentence; 
            if(temp != 0){ 
                sentence = "<tr style='border: 1px solid black; margin: 5px;'><td>Static Link</td></tr>" + sentence; 
                sentence = "<tr style='border: 1px solid black; margin: 5px;'><td>Dynamic Link</td></tr>" + sentence;                 
                sentence = "<tr style='border: 1px solid black; margin: 5px;'><td>Return Address</td></tr>" + sentence;
                numberOfValues =  code[nM].m - 4 - numberOfVariablesInStack; 
                numberOfVariablesInStack += numberOfValues; 
            }
            else {
                numberOfValues = code[nM].m - 4;
                numberOfVariablesInStack = numberOfValues;  
            }

            for(var i = 0; i < numberOfValues; i++){
                sentence = "<tr style='border: 1px solid black; margin: 5px;'><td>Local Value</td></tr>" + sentence;
            }
            if(temp !=0){
                var n = lexicalList.indexOf("30 2 ");
                lexicalList = lexicalList.slice(n+5, lexicalList.length); 
                n = lexicalList.indexOf(" ");
                var nameOfProcedure = lexicalList.slice(0, n); 
                sentence = "<div class='col-sm-3'><p>" + nameOfProcedure + " Proc</p><table style='border: 1px solid black'>" + 
                            "<tr style='border: 1px solid black; margin: 5px;'><td>Functional Value</td></tr>" + sentence;
            }else
                sentence = "<div class='col-sm-3'><p>Main</p><table style='border: 1px solid black'>" + sentence;
            break;

        default:
            break;
        }
        return sentence; 
}