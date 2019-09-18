function renumber(basicProgram) {
    if (!basicProgram) { return; }
    const basicProgramArr = basicProgram.split('\n');
    return processArray(basicProgramArr);
}

function processArray(arr) {
    const matchLeftToken = /^\<\w+\>/g;
    const matchOtherToken = /\<\w+\>$/g;
    const oarr = Array.from(arr);
    for (let i in arr) {
        let leftToken = arr[i].match(matchLeftToken);
        if (leftToken) { leftToken = leftToken[0]; }
        let otherToken = arr[i].match(matchOtherToken);
        if (otherToken) { otherToken = otherToken[0]; }

        // Skip blank lines
        if(arr[i].trim() !== "")  {
          const tokObj = createTokObj(i, leftToken, otherToken);
          arr = processTokenObj(arr, oarr, tokObj, i);
        }
    }
    return arr.join('\n');
}

function createTokObj(lnr, leftTok, otherTok) {
    let result = {lnr: lnr};
    leftTok ? result.leftTok = leftTok : delete result.leftTok;
    otherTok ? result.otherTok = otherTok : delete result.otherTok;
    if (Object.keys(result).length === 1) { result = {}};
    return result;
}

function processTokenObj(arr, oarr, tokObj, ln) {
    if (!isEmpty(tokObj)) {
        const lnr = tokObj.lnr;
        const leftTok = tokObj.leftTok;
        const otherTok = tokObj.otherTok;
        if (leftTok && !otherTok) {
            arr[lnr] = arr[lnr].replace(leftTok, lnr);
        } else if (leftTok && otherTok) {
            const ol = findOtherLineNumber(oarr, otherTok);
            arr[lnr] = arr[lnr].replace(leftTok, lnr).replace(otherTok, ol);
        } else if (otherTok && !leftTok) {
            const ol = findOtherLineNumber(oarr, otherTok);
            arr[lnr] = lnr + ' ' + arr[lnr].replace(otherTok, ol);
        }
    } else {
        arr[ln] = ln + ' ' + arr[ln];
    }
    return arr;
}

function isEmpty(obj) {
    if (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    } else {
        return true;
    }
}

function findOtherLineNumber(oarr, tok) {
    let ret;
    for (let i in oarr) {
        const m = oarr[i].match(new RegExp('^' + tok + '+', 'g'));
        if (m) { ret = i; break; };
    }
    return ret;
}


function renumberThis(text) {
    document.getElementById('txt').value = renumber(text);
}

function loadExample() {
    document.getElementById('txt').value = `<BEGIN> PRINT "HI!"
GOTO <BEGIN>`
}

function loadMastermind() {
      document.getElementById('txt').value = `REM MASTERMIND
REM WRITTEN BY HM (HARDMATH123)
REM G() - GUESS  ARRAY
REM R() - RANDOM ARRAY
REM B   - BLACK HITS
REM W   - WHITE HITS
GOTO <START>
<BEGIN> LET M = 0
DIM G(4)
DIM R(4)
LET R(0) = INT(10*RND(1))
LET R(1) = INT(10*RND(1))
LET R(2) = INT(10*RND(1))
LET R(3) = INT(10*RND(1))
<ENTERNUMBER> PRINT "Enter your guess (4 numbers)"
LET M = M + 1
INPUT G(0)
INPUT G(1)
INPUT G(2)
INPUT G(3)
LET B = 0
IF G(0) = R(0) THEN LET B = B + 1
IF G(1) = R(1) THEN LET B = B + 1
IF G(2) = R(2) THEN LET B = B + 1
IF G(3) = R(3) THEN LET B = B + 1
IF B = 4 THEN GOTO <WIN>
IF B = 1 THEN PRINT "YOU HAVE 1 BLACK HIT."
IF B < 1 THEN PRINT "YOU HAVE NO BLACK HITS."
IF B > 1 THEN PRINT "YOU HAVE"; B; "BLACK HITS."
LET W = 0
LET C = 0
<BACK> IF C = 4 THEN GOTO <TURN>
IF G(C) = R(0) THEN GOTO <RIGHT>
IF G(C) = R(1) THEN GOTO <RIGHT>
IF G(C) = R(2) THEN GOTO <RIGHT>
IF G(C) = R(3) THEN GOTO <RIGHT>
GOTO <ADD>
<RIGHT> LET W = W + 1
<ADD> LET C = C + 1
GOTO <BACK>
<TURN>  LET W = W - B
IF W = 1 THEN PRINT "YOU HAVE 1 WHITE HIT."
IF W < 1 THEN PRINT "YOU HAVE NO WHITE HITS."
IF W > 1 THEN PRINT "YOU HAVE"; W; "WHITE HITS."
GOTO <ENTERNUMBER>
<WIN>  PRINT "YOU WIN! IT ONLY TOOK YOU"; M; "MOVES."
STOP
<START>  PRINT "***              MASTERMIND             ***"
PRINT "              BY ~HARDMATH123"
PRINT "ZOLTAR IS THINKING OF A 4-DIGIT NUMBER. HE "
PRINT "GRADES YOUR GUESSES  IN TWO WAYS:"
PRINT " - YOU GET A 'BLACK' HIT FOR EACH DIGIT IN "
PRINT "   THE CORRECT PLACE."
PRINT " - YOU GET A 'WHITE' HIT FOR EACH DIGIT    "
PRINT "   THAT IS IN ZOLTAR'S NUMBER, BUT IN THE  "
PRINT "   WRONG PLACE."
PRINT "CAN YOU GUESS HIS NUMBER?"
GOTO <BEGIN>`
}
