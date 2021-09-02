# How To Preview Jira Markdown Format in Markdown Preview Enhanced plugin to Atom and VS Code

Markdown Preview Enhanced (MPE) is a markdown extension for Atom and Visual Studio Code. You can find more details about it, here:
https://shd101wyy.github.io/markdown-preview-enhanced/#/

## MPE does not support Jira Markdown, But
MPE is extensible, so we are going to leverage its power to support Jira Markdown style preview.

## Steps:
1. Install MPE
https://shd101wyy.github.io/markdown-preview-enhanced/#/installation
1. You can open any Jira style markdown file in .md or markdown extension and click
*menu->packages->Markdown Preview Enhanced->Toggle preview*

***Note*** if you use the keyboard shortcut: ctrl-shift-M it will probably open the default markdown preview installed in Atom. You will need to disable it first.

3. Extend MPE with Jira:

You can either edit it with the following code or, just replace **~/.mume/parser.js** file in the following fashion:

Open window **command prompt** and type the following commands:

```bash
> cd .mume
> curl -o parser.js https://raw.githubusercontent.com/amihayz/MPE4Jira/main/parser.js
```

**Note:** its assuming the command prompt opens in your user directory
Now you can jump to step 6. to reload the extension.

Or you can edit the changes in by doing the following:

Click **Ctrl-shift-P** then write

```
Markdown Preview enhanced: Extend Parser
```

The file **~/.mume/parser.js** will open in the editor.


Or copy the following code into parser.js:

4. **Overwrite:**
```javascript

onWillParseMarkdown: function(markdown) {
  return new Promise((resolve, reject)=> {
    return resolve(markdown)
  })
},
```

**To**
```javascript

onWillParseMarkdown: function(markdown) {
  return new Promise((resolve, reject)=> {
    // extend parser to show jira style markdown:
    markdown = ExtendToSupportJiraMD(markdown)

    return resolve(markdown)
  })
},
```

5. And copy&paste the next part at the **end** of the parser.js file:

```javascript

function ExtendToSupportJiraMD(markdown) {

  markdown = jiraHeadersToMD(markdown)
  markdown = jiraImageToMDTag(markdown)
  markdown = jiraCodeToMDTag(markdown)

  return markdown;
}

const CODE_REG = /^\s*(\{code\}).*$/gm
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
  markdown = markdown.replace(/!(.*?)!/g,
    function(match, contents, offset, input_string) {
      if (!inCodeSection(markdown,offset))
      {
        let attr = ""
        splitContents = contents.split("|")
        if (splitContents.size > 1 )
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
```

6. **Now, for seeing your updates in Atom**
Run the following command it will reload the editor.
* Hit Ctrl-shift-p then type
```

 Window: Reload
```

and Open any .md file with the preview on and enjoy   
