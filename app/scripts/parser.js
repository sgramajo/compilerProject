//Constants they were defined in the requirements
const MAX_SYMBOL_TABLE_SIZE = 100; 

var symbol_table = [];
var code = [];
var stack_size, token = 0, numVariables = 0;
var cx = 0;  //code index1
var lexical; 
//the following will be used for the symbol table
var index1 = 1, level = -1, address = 4;

function main_Parser(){
    lexical = lexicalList.split(" "); 
	createArrays(); 
	console.log("Creating Arrays"); 
	program();
	printCode(); 
	addToConsole("No errors, program is syntactically correct.\n");
	return;
}//end of main function

function createArrays(){
	var instruction = {op: 0, l: 0, m:0};
	var symbolItem = { kind: 0, name: "", val: 0, level: 0, addr: 0 }; 
	var i; 
	for(i = 0; i < MAX_CODE_LENGTH; i++)
		code.push(instruction); 
	for(i = 0; i < MAX_SYMBOL_TABLE_SIZE; i++)
		symbol_table.push(symbolItem);
}//end of createArrays

function error(stmt){
    addToConsole(stmt); 
	//Quit the program!!!
	return; 
}//end of error function

function get_token(){
	token = lexical[0]; 
    lexical.splice(0, 1);
}

function program(){
	get_token();
	block();
	if (token != 19) //periodsym = 19
		error("Error: Period expected.\n");
}//end of program function

function printCode(){
    var i;
	for (i = 0; i < cx; i++)
		$("#mCode").append(code[i].op + " " + code[i].l + " " + code[i].m + "\n");
	console.log("cx was " + cx);
	console.log(code);  
}//end of printCode function

function block()
{
	level++;
	var space = 4, jmpaddr = cx, prev_cx = index1;
	emit(7, 0, 0); //JMP == 7
	if (token == 28) //constsym = 28 -- reserved Word
		constDeclaration();

	//always store ident = "return"-- one at every level
	enter_symbol(2, "return", level, 0);

	if (token == 29) //varsym = 29 -- reserved Word
		varDeclaration();

	space += numVariables;

	if (token == 30) //procsym = 30 --reserved Word
		procDeclaration();

	code[jmpaddr].m = cx;
	emit(6, 0, space); //INC == 6
	//stack_size = space;
	statement();
	emit(2, 0, 0); //OPR = 2 | RET = 0
	level--;
	index1 = prev_cx;
}//end of block function

function constDeclaration(){
	var kind = 1; //for the symbol table (const = 1)
	do{
		get_token();
		if (token != 2)//identsym = 2
			error("Error: Constant declaration must be followed by an identifier.\n");

	    get_token(); //scanning for the word
        var array_charact = token; 
		
        get_token();

		if (token != 9)//eqlsym ("=") = 9
			error("Error: The identifier must be followed by an equal sign.\n");

		get_token();
		if (token != 3)//NUMBER = 9
			error("= must be followed by a number.");

		get_token(); 
		enter_symbol(kind, array_charact, token, address);
		get_token();
	} while (token == 17); //commasym = 17 //end of while statement

	if (token != 18)//semicolonsym = 18
		error("Error: Semicolon is missing.\n");
	get_token();
}//end of constDeclaration

function varDeclaration(){
	var kind = 2; //var = 2 for the symbol table

	do{
		get_token();
		if (token != 2)//identsym = 2
			error("Error: Variable declaration must be followed by an identifier.\n");

		var i = 0;
        get_token(); 
		enter_symbol(kind, token, level, address);
		address++;
		get_token();
		numVariables++;
	} while (token == 17); //commasym = 17

	if (token != 18)//semicolonsym = 18
		error("Error: Semicolon is missing.\n");
	get_token();
}//end of varDeclaration

function procDeclaration(){
	var kind = 3; //proc = 3 for the symbol table
	do{
		get_token();
		if (token != 2) //identsym =2
			error("Error: Procedure declaration must be followed by an identifier.\n");

		var i = 0;
		get_token(); 
		enter_symbol(kind, token, level, cx); //what address
		get_token();
		parameter_block();

		if (token != 18) //semicolonsym = 18
			error("Error: Semicolon is missing.\n");

		get_token();
		block();

		if (token != 18) //semicolonsym = 18
			error("Error: Semicolon is missing.\n");

		if (token != 18) //semicolonsym = 18
			error("Error: Semicolon is missing.\n");

		get_token();
	} while (token == 30); //procsym = 30 --reserved Word
}//end of procDeclaration function

function parameter_block(){
	numVariables = 0; //back to zero
	var kind = 2; //variables
	if (token != 15) //lparentsym = 15 "("
		error("Error: Procedure must have parameters.");

	get_token();
	address = 4;
	if (token == 2)//identity sym = 2
	{
		var i = 0;
        get_token(); 
		enter_symbol(kind, token, level+1, address); //what address
		numVariables++;
		address++;
		get_token();

		while (token == 17) //17 = commasym
		{
			get_token();
			if (token != 2)
				error("Error: Identity symbol is missing.");

			get_token(); 

			numVariables++;
			enter_symbol(kind, token, level+1, address); //what address
			address++;
			get_token();
		}
		if (token != 16)//rparentsym = 16 ")"
			error("Error: Right parenthesis missing.\n");
		get_token();
	}
}

function parameter_list(){
	var params = 0;
	if (token != 15)//15= lparentsym
		error("Error: Missing parameter list at call.");

	get_token();

	if (token != 16){
		expression();
		params++;
	}

	while (token == 17) //17 = commasym
	{
		get_token();
		expression();
		params++;
	}

	while (params > 0)
	{ //save results into param slots
		//stack_size += (params - 1);
		emit(4, 0, stack_size + 4 -1);
		params--;
		//stack_size--;
	}

	if (token != 16)
		error("Error: Right parenthesis missing and Bad calling formating");
}

function statement(){
	var cx1, cx2;
	if (token == 2) //identsym = 2
	{
        get_token(); 

		console.log(token); 
		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared identifier.\n");
		
		console.log("Symbol_table - k: " + k); 
		if (symbol_table[k].kind != 2) //variable == 2
			error("Error: Assignment to constant or procedure is not allowed.\n");

		get_token();
		if (token != 20)//becomessym = 20 ":="
			error("Error:Identifier must be followed by ':='.\n");

		get_token();
		expression();
		emit(4, level - symbol_table[k].level, symbol_table[k].addr); //STO = 4
	}
	else if (token == 21) //beginsym = 21
	{
		address++;
		get_token();
		statement();
		while (token == 18)//semicolonsym = 18
		{
			get_token();
			statement();
		}//end of while statement
		if (token != 22) //endsym = 22
			error("Error: 'End' expected.\n");

		get_token();
	}
	else if (token == 23) //ifsym = 23
	{
		get_token();
		condition();
		if (token != 24) //thensym = 24
			error("Error: 'Then' expected.\n");

		get_token();
		var ctemp = cx;
		emit(8, 0, 0);//VM: JPC = 8
		statement();
		code[ctemp].m = cx;

		if (token == 33) //elsesym = 33
		{
			get_token();
			code[ctemp].m++;
			var ctemp2 = cx;
			emit(7, 0, 0);//JMP
			statement();
			code[ctemp2].m = cx;
		}
	}//end of if-then statement
	else if (token == 27){ //callsym = 27
		get_token();
		if (token != 2)
			error("Error: Call must be followed by an identity.\n");

        get_token(); 

		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared Identifier.\n");

		get_token();
		parameter_list();

		if (symbol_table[k].kind == 3)//CAL = 5
			emit(5, level - symbol_table[k].level, symbol_table[k].addr);
		else
			error("Error: Call must be followed by a procedure identifier.\n");

		get_token();
	}
	else if (token == 25){//whilesym= 25
		cx1 = cx;
		get_token();
		condition();
		cx2 = cx;
		emit(8, 0, 0); //VM: JPC = 8
		if (token != 26)//dosym = 26
			error("Error: 'Do' symbol is expected.\n");
		else
			get_token();

		statement();
		emit(7, 0, cx1); //VM: JMP = 7
		code[cx2].m = cx;
	}
	else if (token == 31){ //writesym = 31
		get_token();
		if (token != 2)
			error("Error: Ident is missing.\n");

		get_token(); 
		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared Identifier.\n");
		if (symbol_table[k].kind == 1)
			emit(3, level - symbol_table[k].level, symbol_table[k].val);
		else
			emit(3, level - symbol_table[k].level, symbol_table[k].addr); //LOD == 3

		emit(9, symbol_table[k].level, 1); //SIO = 9
		get_token();
	}
	else if (token == 32)//readsym = 32
	{
		get_token();
		if (token != 2)
			error("Error: Ident is missing.\n");

        get_token(); 

		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared Identifier.\n");

		if (symbol_table[k].kind == 1) //constant == 1
			error("Error Found --- Exit Immediately");

		emit(10, 0, 2); //SIO = 10
		emit(4, level - symbol_table[k].level, symbol_table[k].addr); //LOD == 3
		get_token();
	}
}//end of statement function

function expression(){ //VM information: OPR == 2  example: emit(OPR, 0, OPR_ADD || OPR_SUB),
	//OPR_ADD == 2, OPR_SUB == 3, OPR_NEG == 1
	var op;
	if (token == 4 || token == 5){ //plussym = 4 -- adding_operator
		op = token;
		get_token();
		term();
		if (op == 5) //minussym = 5
			emit(2, 0, 1); //OPR_NEG == 1
	}
	else
		term();

	while (token == 4 || token == 5) //plussym = 4 -- adding_operator
	{					//minussym = 5
		op = token;
		get_token();
		term();
		if (op == 4)//plussym = 4 -- adding_operator
			emit(2, 0, 2); //addition
		else
			emit(2, 0, 3); //subtraction
	}
}//end of expression function

function term(){//VM Information:
	//OPR = 2 example emit(OPR, 0, OPR_MUL)
	var op;
	factor();
	while (token == 6 || token == 7) //multsym = 6 --- multiplying_operator
	{						//slashsym = 7
		op = token;
		get_token();
		factor();
		if (op == 6) //multsym = 6 --- multiplying_operator
			emit(2, 0, 4); //multiplication-- OPR_MUL = 4
		else
			emit(2, 0, 5); //Division --- OPR_DIV = 5
	}//end of while statement
}//end of term function

function factor(){
	if (token == 2) //idensymbol == 2
	{
		var i = 0, temp;
        get_token();

		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared Identifier.\n");
		if (symbol_table[k].kind == 2) //variable == 2
			emit(3, level - symbol_table[k].level, symbol_table[k].addr); //LOD == 3
		else if (symbol_table[k].kind == 1) //constant ==1
			emit(1, 0, symbol_table[k].val); //LIT == 1
		else
			error("Error Found --- Exit Immediately");

		get_token();
	}
	else if (token == 3)//its a number
	{
        get_token(); 
		emit(1, 0, token);//LIT == 1
		get_token();
	}
	else if (token == 15) //lparentsym = 15 "("
	{
		get_token();
		expression();
		if (token != 16)//rparentsym = 16 ")"
			error("Error: Right parenthesis missing.\n");

		get_token();
	}
	else if (token == 27) //callsym = 27
	{
		get_token();
		if (token != 2)
			error("Error: Call must be followed by an identity.\n");

		get_token(); 

		var k = findsym(token);
		if (k == -1)
			error("Error: Undeclared Identifier.\n");

		get_token();
		parameter_list();

		if (symbol_table[k].kind == 3)//CAL = 5
			emit(5, level - symbol_table[k].level, symbol_table[k].addr);
		else
			error("Error: Call must be followed by a procedure identifier.\n");

		emit(6, 0, 1);//INC == 6
		get_token();
	}
	else
		error("Error: Incorrect symbol following statement.\n");
}//end of factor function

function condition(){
	if (token == 8){ //oddsym = 8
		get_token();
		expression();
		emit(2, 0, 6); //OPR == 2 --- ODD == 6
	}
	else{
		expression();
		//there are six relational operators
		//< (less than), <= (less than or equal to), > (greater than), >=, == (equal to),
		// /= (not equal to)
		if (token != 13 && token != 14 && token != 12 && token != 11 && token != 9 && token != 10) //these numbers correspond to one of the relations above
			error("Error: Relational operator expected.\n");

		var k = find_symbol_type(token);
		get_token();
		expression();
		emit(2, 0, k); //OPR == 2;
	}
}//end of condition function

function enter_symbol(kind, array, temp, addr){
	var symbolTry; 
	if (kind == 1)//then it is a const
		symbolTry = {kind: kind, name: array, val: temp, level: 0, addr: 0}; 
	else
		symbolTry = {kind: kind, name: array, val: 0, level: temp, addr: addr}; 
	
	symbol_table[index1] = symbolTry; 
	index1++;
}//end of enter_symbol function

function emit(op, l, m){
	if (cx > MAX_STACK_HEIGHT)
		error("Error: There was a stack overflow.\n");
	else{
		var codeItem = {op: op, l:l, m:m};
		code[cx] = codeItem;
		updateStackSize(op, l, m);
		cx++;
	}
}//end of emit function

function updateStackSize(op, l, m){
	if (op == 1 || op == 3 || op == 10)//LIT, LOD, READ
		stack_size++;
	else if (op == 4 || op == 8 || op == 9)//STO, JPC, WRITE
		stack_size--;
	else if (op == 6)//INC
		stack_size += m;
	else if (op == 2){//OPR
		if (m == 0)//RET
			stack_size = 0;
		else if (m != 1 || m != 6)//NEG and ODD
			stack_size--;
	}
}
function findsym(array){
	var temp1 = index1 - 1, found = -1;
	while (temp1 > 0){
		console.log("Temp1 is " + temp1 + " Checking here Name: " + symbol_table[temp1].name + " == " + array); 
		if (symbol_table[temp1].name == array){
			found = temp1;
			break;
		}
		console.log("Next"); 
		temp1--;
	}
	return found;
}

function find_symbol_type(symbolItem){
	if (symbolItem == 9)
		return 8; //EQL == 8
	else if (symbolItem == 10)
		return 9; //NEQ == 9 '!='
	else if (symbolItem == 11)
		return 10; //LSS == 10 '<'
	else if (symbolItem == 12)
		return 11; //leq "<="
	else if (symbolItem == 13)
		return 12;
	else
		return 13;
}