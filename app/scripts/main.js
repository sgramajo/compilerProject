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
}

/* New File */
function newFile(){
    editor.setValue("");
    editor.clearHistory(); 
}
function goback(){
    editor.undo();
}
function redo(){
    editor.redo(); 
}