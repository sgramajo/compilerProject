/*
    Stacy Gramajo
    Compiler Construction
    Homework 1
*/

//The constant values for stack height, code length, and lexi levels - referenced in the requirements
const MAX_STACK_HEIGHT = 2000; 
const MAX_CODE_LENGTH = 500; 
const MAX_LEXI_LEVELS = 3; 

//initialize PM/0 CPU registers
var nSP = 0;
var nBP = 1;
var nPC = 0;
var previous_instruction = 0;
var nIR = new Object(); //needs int op, int l, int m
var halt = true;
var idResults = "#results"; //where the results will be placed
var consoleResults = "#console"; //where the console results will be placed 

//initializing arrays
var code = []; 
//Initial "stack" store values -- All must be 0's
var stack = Array.apply(null, Array(MAX_STACK_HEIGHT)).map(Number.prototype.valueOf,0);
var bar = Array.apply(null, Array(MAX_STACK_HEIGHT)).map(Number.prototype.valueOf,0);

function addToConsole(text){ //with Date
    $('#console span').last().remove();
    $(consoleResults).append("\t>>\t[" + (new Date($.now())).getHours() + ":" + (new Date($.now())).getMinutes() + ":" + (new Date($.now())).getSeconds() + "] " + text); 
    $(consoleResults).append("\t>>\t<span></span>"); 
}
function addConsoleText(text){ //Only Text
    $(consoleResults).append("[Reminder] " + text); 
    $(consoleResults).append("\t>>\t<span></span>"); 
}
function main(){
    addToConsole("Starting PM/O Machine ...\n"); 
    // Initial values for the PM/O CPU registers
    var i=0;
    var j=0;
    nIR = {op: 0, l: 0, m: 0}; 
    //initializing the top part of the file
    $(idResults).append("Line\t OP\t L\t M\n");
    //Saving the instructions onto a "code" store location, an array
    while(i < editor.lineCount()){
        var instruction = editor.getLine(i).split(" "); 
        var oneInstruc = {op: instruction[0], l: instruction[1], m: instruction[2]}; 
        code.push(oneInstruc); 
        print_function(i, code[i].op, code[i].l, code[i].m);
        i++;
    }
    
    $(idResults).append("\t\t\t\t PC\t BP\t SP\t stack\n");
    $(idResults).append("Initial values\t\t\t " + nPC + "\t " + nBP + "\t " + nSP + "\n");

    i=0;
    //execute the instructions - PM/O instruction cycle carries out two steps, fetch and execute
   while(halt != false && nBP != 0){
        fetch();
        execute();
        previous_instruction = nPC;
   }
   
}//end of main function

/*
  print_function is used to print the results in the file
  Parameters: temp = Instruction Number,
               nOP = The Operation Code,
                nL = Lexicographical Levels,
                nM = A Number, A Program Address, or the identity of the operator
*/
function print_function(temp, nOP, nL, nM){
    
    switch(nOP){
    case "1":
        $(idResults).append(temp + "\t LIT\t " + nL + "\t " + nM + "\n");
        break;

    case "2":
        $(idResults).append(temp + "\t OPR\t " + nL + "\t " + nM + "\n");
        break;

    case "3":
        $(idResults).append(temp + "\t LOD\t " + nL + "\t " + nM + "\n");
        break;

    case "4":
        $(idResults).append(temp + "\t STO\t " + nL + "\t " + nM + "\n");
        break;

    case "5":
        $(idResults).append(temp + "\t CAL\t " + nL + "\t " + nM + "\n");
        break;

    case "6":
        $(idResults).append(temp + "\t INC\t " + nL + "\t " + nM + "\n");
        break;

    case "7":
        $(idResults).append(temp + "\t JMP\t " + nL + "\t " + nM + "\n");
        break;

    case "8":
        $(idResults).append(temp + "\t JPC\t " + nL + "\t " + nM + "\n");
        break;

    case "9":
        $(idResults).append(temp + "\t SIO\t" + nL + "\t " + nM + "\n");
        break;

    case "10":
        $(idResults).append(temp + "\t SIO\t " + nL + "\t " + nM + "\n");
        break;

    case "11":
        $(idResults).append(temp + "\t SIO\t " + nL + "\t " + nM + "\n");
        break;
    }

}//end of print_function

/* base function finds a variable from an Activation Record for L levels down
    Parameters: l = stands for L in the instruction format,
                base = base needed to return to
*/
function base_function(l, base)
{
  var b1; //find base L levels down
  b1 = base;
  while (l > 0)
  {
    b1 = stack[b1 + 1];
    l--;
  }
  return b1;
}

/* fetch function fetches the instruction from the "code" memory store,
    stores it in IR register, and increment PC, program counter, to point to the next instruction
*/
function fetch(){
    nIR = code[nPC];
    nPC++;
    return 1;
}//end of fetch function

/* execute is the second cycle where the instruction retrieved is being executed using the "stack" storing place by the VM
    In the function, the OP from the IR register is used to figure out the instruction that should be executed, and
    M is the operator + runs the correct arithmetic/logical instruction
*/
function execute(){
    nSP = trimLeadZero(nSP); 
    switch(nIR.op){ //Explanations are taken for the instructions are taken from the HW instructions sheet - A copy is in the same folder where the code is being held
        case "1": //LIT O,M --- Pushes constant value (literal) M onto the stack
            nSP= Number(nSP) + 1;
            stack[nSP] = nIR.m;
            $(idResults).append(previous_instruction + "\t LIT\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "2": //OPR 0, M --- Operation to be performed on the data at the top of the stack
            logical_operation();
            $(idResults).append(previous_instruction + "\t OPR\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "3"://LOD L,M -- Load value into top of stack from the stack location at offset M
                //from L lexicographical levels down
            nSP = Number(nSP) + 1;
            stack[nSP] = stack[base_function(nIR.l, nBP) + Number(nIR.m)];
            $(idResults).append(previous_instruction + "\t LOD\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "4"://STO L, M --- Store value at top of stack in the stack location at offset M
                //from L lexicographical levels down
            stack[base_function(nIR.l, nBP) + Number(nIR.m)] = stack[nSP];
            nSP = Number(nSP) - 1;
            $(idResults).append(previous_instruction + "\t STO\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "5"://Call procedure at code index M (generates new Activation REcord and Pc<- M)
            stack[Number(nSP) + 1] = 0;                    //Space to return value (FV)
            stack[Number(nSP) + 2] = base_function(nIR.l, nBP);     //static link(SL)
            stack[Number(nSP) + 3] = nBP;                  //dynamic link (DL)
            stack[Number(nSP) + 4] = nPC;                   //Return Address (RA)
            nBP = Number(nSP) + 1;
            nPC = nIR.m;
            $(idResults).append(previous_instruction + "\t CAL\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            bar[nSP] = 1;
            break;

        case "6"://INC 0,M --- Allocate M locas (increment sp by M). First four are Functional Value
                //(FV, also calle dreturn value), Static Links(SL), Dynamic Link (DL), and Return Address (RA)
            nSP = Number(nSP) + Number(nIR.m);
            $(idResults).append(previous_instruction + "\t INC\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "7": //JMP 0, M --- Jump to instruction M
            nPC = nIR.m;
            $(idResults).append(previous_instruction + "\t JMP\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "8":// JPC 0, M --- Jump to instruction M if top stack element is 0.
            if(stack[nSP] == 0){
                nPC = nIR.m;
            }
            nSP = Number(nSP) - 1;
            $(idResults).append(previous_instruction + "\t JPC\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "9": //SIO 0,1 --- Write the top stack element to the screen
            $(consoleResults).append("Element on the top of the stack\n"); 
            $(consoleResults).append("\t>>\t" + stack[nSP]);
            nSP = Number(nSP) - 1;
            $(idResults).append(previous_instruction + "\t SIO\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "10": //SIO 0, 2 --- Read in input from the user and store it at the top of the stack
            nSP= Number(nSP) + 1;
            addConsoleText("Type number to put in top of the stack ...\n"); 
            stack[nSP] = 4; //change for later
            //$(consoleResults).append("<input type='text' autofocus id='addText'>"); 
            $(idResults).append(previous_instruction + "\t SIO\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

        case "11": //SIO 0, 3 --- Halt the machine
            halt = false;
            $(idResults).append(previous_instruction + "\t SIO\t " + nIR.l + "\t " + nIR.m + "\t " + nPC + "\t " + nBP + "\t " + nSP + "\t");
            print_operation();
            break;

    }//end of switch statement
}//end of execute function

/* print_operation prints out the stack into the file */
function print_operation(){
    var k;
    var temp = Number(nSP) + 1; 
    for(k = 1; k < temp; k++){
        $(idResults).append(stack[k] + " ");
        if(bar[k] == 1){
            $(idResults).append("| ");
        }
    }
    $(idResults).append("\n");
}//end of print_operation function

/* logical_operation focuses on the various operations performed on
    the data that is on top of the stack. It uses the IR register (m component) to
    know exactly what operation should be done */

function logical_operation(){
    switch(nIR.m){
    case "0"://RETURN
        nSP= nBP -1;
        nPC = stack[nSP + 4];
        nBP = stack[nSP + 3];
        bar[nSP]= 0;
        break;

    case "1"://NEG
        stack[nSP] = stack[nSP] * -1;
        break;

    case "2"://ADD
        nSP = Number(nSP) - 1;
        stack[nSP] = stack[nSP] + stack[Number(nSP) + 1];
        break;

    case "3"://SUB
        nSP = Number(nSP) -1;
        stack[nSP] = stack[nSP] - stack[Number(nSP) + 1];
        break;

    case "4"://MUL
        nSP= Number(nSP) -1;
        stack[nSP]= stack[nSP] * stack[Number(nSP) +1];
        break;

    case "5"://DIV
        nSP= Number(nSP) -1;
        stack[nSP] = stack[nSP] / stack[Number(nSP) +1];
        break;

    case "6"://ODD
        stack[nSP] = stack[nSP] % 2;
        break;

    case "7"://MOD
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP]) % (stack[Number(nSP) + 1]);
        break;

    case "8"://EQL
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] == stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    case "9"://NEQ
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] != stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    case "10"://LSS
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] < stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    case "11"://LEQ
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] <= stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    case "12"://GTR
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] > stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    case "13"://GEO
        nSP= Number(nSP) -1;
        stack[nSP]= (stack[nSP] >= stack[Number(nSP) + 1]) ? 1 : 0;
        break;

    }//end of switch statement
    return 1;
}//end of logical_operation function
