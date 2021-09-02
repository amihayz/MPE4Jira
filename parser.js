module.exports = {
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      // extend parser to show jira style markdown:
      markdown = ExtendToSupportJiraMD(markdown)

      return resolve(markdown)
    })
  },
  onDidParseMarkdown: function(html, {cheerio}) {
    return new Promise((resolve, reject)=> {

      return resolve(html)
    })
  },
  onWillTransformMarkdown: function (markdown) {
        return new Promise((resolve, reject) => {
            return resolve(markdown);
        });
    },
  onDidTransformMarkdown: function (markdown) {
      return new Promise((resolve, reject) => {
          return resolve(markdown);
      });
  },
  ExtendToSupportJiraMD,
  jiraHeadersToMD,
  jiraImageToMDTag,
  jiraCodeToMDTag
}

function ExtendToSupportJiraMD(markdown) {

  markdown = jiraHeadersToMD(markdown)
  markdown = jiraImageToMDTag(markdown)
  markdown = jiraCodeToMDTag(markdown)

  return markdown;
}

const CODE_REG = /^\s*(\{code(\:(\w)*)*\})\s*$/gm // /^\s*(\{code\:w\}).*$/gm
// Map jira headers to markdown headers
// Repalce # with #, ## with ## and so on till h9.
function jiraHeadersToMD(markdown){
  for (let i=1;i<10;i++) {
    let dashes = "#".repeat(i);
    let reg =  new RegExp(`h${i}. `,'gm');
    markdown = markdown.replace(reg, dashes + " ")
  }
  return markdown
}
// Change jira image format to <img>
//  !img.png|width=800! should be converted to
//  < img src="img.png" width=800></img>
// Make sure this runs before you change the {code} to ```
function jiraImageToMDTag(markdown){
  markdown = markdown.replace(/!(.*?)!/gm,
    function(match, contents, offset, input_string) {
      if (!inCodeSection(markdown,offset))
      {
        let attr = ""
        splitContents = contents.split("|")
        if (splitContents.length > 1 )
            attr = splitContents[1]
        return `<img src="${splitContents[0]}" ${attr}></img>`
      }
      return match
    });
  return markdown
}

// Pass the entire markdown and current offset in it, (of the tag we handle now)
// returns true if we are inside a {code} section
function inCodeSection(markdown,offset) {
  // make sure we are not inside a code section
  let before = markdown.slice(0,offset)
  let splitByCode = [...before.matchAll(CODE_REG)]
  // An even number of {codes} sections meanswe are inside one
  // thus should not replace any tags
  if (splitByCode.length % 2 != 0)
    return true;
  return false;
}

function jiraCodeToMDTag(markdown) {
    markdown = markdown.replace(CODE_REG,
      function(match, contents, offset, input_string) {
        let lang = ""
        splitContents = contents.slice(0,-1).split(":")
        if (splitContents.length > 1 )
            lang = splitContents[1]
        return "\n```"+ lang + "\n"
    })

  return markdown
}
