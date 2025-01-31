
// const markdown = `

// ---
// title: "To Be A Leader"
// author: "Jonathan Duarte"
// ---


// # Header 1
// ## Header 2
// ### Header 3

// Paragraph

// This is **bold**, __bold indeed__!;
// But this _is italic_, *italic indeed*.

// * this
// * is
// * a
// * list


// However

// - this
// - is
// - one
// - toooo

// How about we are both **_bold and italic at the same time_**?
// Or _**Italic and bold **_ or perhaps ___ italic or bold ___?
// `

// parse(markdown);

export function parse(text: string) : string {
    return replaceFrontmatter(replaceHeaders(replaceItalic(replaceBold(replaceList(replaceParagraphs(text))))));
}

export function matchFrontmatter(text: string) : RegExpMatchArray {
    const regexp = /^---([\s\S]+?)---$/m;
    return text.match(regexp);
}

export function replaceFrontmatter(text: string) : string {
    const match = matchFrontmatter(text);

    if(match) {
        text = text.replace(match[0], "");
    }

    return text;
}

function replaceHeaders(text: string) : string {
    const regexp = /^(#{1,6})\s+(.+)$/gm;
    const matches = text.matchAll(regexp);

    for (const match of matches) {
        text = text.replace(match[0], headerTag(match.slice(1,3)))

    }
    return text;
}

function replaceBold(text: string) : string {
    const regexp = /\*\*(.+?)\*\*|__(.+?)__/gm;
    const matches = text.matchAll(regexp);
    for (const match of matches) {
        text = text.replace(match[0], boldTag(match.slice(1,3)));
    }
    return text;
}

function replaceParagraphs(text: string) : string {
    const regexp = /^(?!\s*(?:#|\*|\-|---|\w+:)).+/gm;
    const matches = text.matchAll(regexp);
    for (const match of matches) {
        text = text.replace(match[0], paragraphTag(match));
    }
    return text;
}

function replaceList(text: string) : string {
    const regexp = /(([\*|-] {1,}.*\n)+\n)/gm;
    const matches = text.matchAll(regexp);

    for (const match of matches) {
        const li = match[0].split("\n").map(e => e.split(/\* |- /)[1]).filter(e => e != undefined && e != "").map(e => `<li>${e}</li>`).join("")
        const ul = `<ul>${li}</ul>`;
        text = text.replace(match[0], ul);
    }

    return text;
}

function replaceItalic(text: string) : string {
    const regexp = /\*(.+?)\*|_(.+?)_/gm;
    const matches = text.matchAll(regexp);
    for (const match of matches) {
        text = text.replace(match[0], italicTag(match.slice(1,3)));
    }
    return text;
}

function headerTag(matches: string[]): string {
    const size = matches[0].length;
    const text = matches[1];
    return `<h${size}>${text}</h${size}>`
}

function paragraphTag(matches: string[]): string {
    const text = matches[0];
    return `<p>${text}</p>`
}

function boldTag(matches: string[]): string {
    const text = matches[0] || matches[1];
    return `<strong>${text}</strong>`;
}

function italicTag(matches: string[]): string {
    const text = matches[0] || matches[1];
    return `<em>${text}</em>`;
}