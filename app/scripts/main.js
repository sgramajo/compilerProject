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
    $(consoleResults).append("<span>\t>>\t</span>"); 
}
/* New File */
function newFile(){
    editor.setValue("");
    editor.clearHistory(); 
    restartConsole(); 
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
    var text = document.getElementById('demotext');
    var blob = new Blob([text.value], {type: "text/plain;charset=utf-8"}); 
	saveAs(blob, "compilerCode.txt");
}