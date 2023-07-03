
const jsTokens = require("js-tokens");


/**
 * @typedef Token
 * @type {object}
 * @property {string} type - type names returned by js-tokens.
 * @property {string} value - an island of characters seen in an input string to the parser.
 */


/**
 * Finds syntactic islands that should be one term and updates the array so that the clumps
 * are represented by a single syntact atom.
 * 
 * @param {Token[]} line_tokens -- token list returned by jsTokens
 * @returns {Token[]} -- the updated line tokens array
 */
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


/**
 * Takes in single line of text and passes it to jsTokens for parsing.
 * Calls `clump_clumps` to put file paths and similar strings into single atoms.
 * Removes white spaces from the list as well as tokens that have been marked for discard by `clump_clumps`.
 * 
 * @param {string} line -- a single line of text which may be some command line with file paths, strings, and command atoms
 * @returns {Token[]} -- The filtered tokens
 */
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


/**
 * Returns a space delimited string of tokens taken from the token_list.
 * @param {Token[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @param {number} count  -- the count as `start` in JS `slice` method.
 * @returns {string | boolean} -- the string is space delimited. If the string is empty, false is returned
 */
function front_tokens(token_list,start,count) {
    if ( Array.isArray(token_list) ) {
        let sublist = token_list.slice(start,start + count)
        sublist = sublist.map( tok => {
            return tok.value
        })
        let s = sublist.join(' ')
        if ( s.length === 0 ) return false
        return s
    }
    return false
}


/**
 * Returns a space delimited string of tokens taken from the token_list 
 * starting at `start` and ending at the end of the list.
 * 
 * @param {Token[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @returns {string | boolean} -- the string is space delimited. If the string is empty, false is returned
 */
function rest_tokens(token_list,start) {
    if ( Array.isArray(token_list) ) {
        let sublist = token_list.slice(start)
        sublist = sublist.map( tok => {
            return tok.value
        })
        let s = sublist.join(' ')
        if ( s.length === 0 ) return false
        return s
    }
    return false
}

/**
 * Returns an array of string of tokens taken from the token_list 
 * starting at `start` and ending at the end of the list.
 * 
 * @param {Token[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @returns {string[] | boolean} -- the . If the string is empty, false is returned
 */
function rest_tokens_array(token_list,start) {
    if ( Array.isArray(token_list) ) {
        let sublist = token_list.slice(start)
        sublist = sublist.map( tok => {
            return tok.value
        })
        if ( sublist.length === 0 ) return false
        return sublist
    }
    return false
}


module.exports.tokenize = tokenize;
module.exports.front_tokens = front_tokens;
module.exports.rest_tokens = rest_tokens;
module.exports.rest_tokens_array = rest_tokens_array;

