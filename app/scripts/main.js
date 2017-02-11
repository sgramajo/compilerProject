var editor; 
window.onload = function() {
    /* CodeMirror Elements Startup */
    editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
        lineNumbers: true,
        mode: "text/html",
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