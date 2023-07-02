
const jsTokens = require("js-tokens");


function clump_clumps(line_tokens) {
    let n = line_tokens.length
    let clump = []
    let clump_state = false
    let clump_start = Infinity
    for ( let i = 0; i < n; i++ ) {
        let tok = line_tokens[i]
        if ( ((tok.type === 'Punctuator') 
                || ((tok.type === 'IdentifierName') && (line_tokens[i+1].type === 'Punctuator'))) && !clump_state ) {
            clump.push(tok)
            clump_state = true
            clump_start = i
        } else if ( tok.type === 'WhiteSpace' ) {
            if ( clump_state ) {
                clump_state = false
                let start_tok = line_tokens[clump_start]
                let clumped = ""
                clump_start = Infinity
                for ( let ctok of clump ) {
                    ctok.type = 'spent'
                    let str = ctok.value
                    ctok.value = '-'
                    clumped += str
                }
                clump = []
                start_tok.value = clumped
                start_tok.type = 'ClumpedTokens'
            }
        } else if ( clump_state ) {
            clump.push(tok)
        }
    }

    return line_tokens
}


function tokenize(line) {
    line += ' '  // helps with clumping
    let line_tok = Array.from(jsTokens(line))

    line_tok = clump_clumps(line_tok)

    line_tok = line_tok.filter( tok => {
        if ( tok.type === 'WhiteSpace' ) return false
        if ( tok.type === 'spent' ) return false
        return true
    })

    return line_tok
}



module.exports.tokenize = tokenize;