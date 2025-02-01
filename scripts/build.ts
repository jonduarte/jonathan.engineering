import * as fs from "fs";
import * as path from "path";
import { matchFrontmatter, parse } from "./markdown";

const POSTS = path.join(__dirname, "../posts");
const OUTPUT = path.join(__dirname, "../deploy/")
const PUBLIC = path.join(__dirname, "../public");

const readFile = (path: string) => {
    return fs.readFileSync(path).toString();
}

const readTemplate = (templateName: string) : string => {
    return readFile(path.join(PUBLIC, templateName));
}

const getTitle = (text: string) => {
    const match = matchFrontmatter(text);
    let title = "";
    
    if(match) {
        const titleMatch = match[1].match(/^title:\s*"([^"]+)"/m);
        title = titleMatch[1];
    }

    return title;
}

const files = fs.readdirSync(POSTS);
type Link = {
    title: string;
    url: string;
};
const links: Link[] = [];

files.forEach(file => {
    const dest = path.join(OUTPUT, file.replace(".md", ".html"));
    const raw  = readFile(path.join(POSTS, file))
    const title = getTitle(raw);
    const content = parse(raw);
    const template = readTemplate("index.html");
    const html = template.replace("{title}", title).replace("{content}", content);
    links.push({ url: file.replace(".md", ""), title });
    fs.writeFileSync(dest, html);
})


const template = readTemplate("index.html");
const title = "Jonathan [.] Engineering";
const content = "<ul>"  + links.map(link => `<li><a href="/${link.url}">${link.title}</a></li>`).join("") + "</ul>";
const dest = path.join(OUTPUT, "index.html");
const html = template.replace("{title}", title).replace("{content}", content);
fs.writeFileSync(dest, html);

console.log("-- build finished --");