import { Token } from "js-tokens";
/**
 * @typedef Token
 * @type {object}
 * @property {string} type - type names returned by js-tokens.
 * @property {string} value - an island of characters seen in an input string to the parser.
 */
export declare type LToken = Token | {
    type: "spent";
    value: string;
} | {
    type: "ClumpedTokens";
    value: string;
};
/**
 * Takes in single line of text and passes it to jsTokens for parsing.
 * Calls `clump_clumps` to put file paths and similar strings into single atoms.
 * Removes white spaces from the list as well as tokens that have been marked for discard by `clump_clumps`.
 *
 * @param {string} line -- a single line of text which may be some command line with file paths, strings, and command atoms
 * @returns {LToken[]} -- The filtered tokens
 */
export declare function tokenize(line: string): LToken[];
/**
 * Returns a space delimited string of tokens taken from the token_list.
 * @param {LToken[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @param {number} count  -- the count as `start` in JS `slice` method.
 * @returns {string | boolean} -- the string is space delimited. If the string is empty, false is returned
 */
export declare function front_tokens(token_list: LToken[], start: number, count: number): string | boolean;
/**
 * Returns a space delimited string of tokens taken from the token_list
 * starting at `start` and ending at the end of the list.
 *
 * @param {LToken[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @returns {string | boolean} -- the string is space delimited. If the string is empty, false is returned
 */
export declare function rest_tokens(token_list: LToken[], start: number): string | boolean;
/**
 * Returns an array of string of tokens taken from the token_list
 * starting at `start` and ending at the end of the list.
 *
 * @param {LToken[]} token_list -- a token list returned from `tokenize`
 * @param {number} start -- the same as `start` in JS `slice` method.
 * @returns {string[] | boolean} -- the . If the string is empty, false is returned
 */
export declare function rest_tokens_array(token_list: LToken[], start: number): string[] | boolean;
