const p = require("./parser")

const fs = require('fs').promises;
(async function() {
    
  let markdown = " \n\
        {code}   \n\
      //  !img.png|width=800! should be converted to \n \
  function jiraCodeToMDTag(markdown) { \n\
    return markdown.replace(/\\{code.*\\}/g,\"```\") \n\
  } \n\
  \n \
        \"{code}\" \n\
        {code} \
  ";
  let mdfile = "C:\\Users\\azer-kavod\\OneDrive - Align Technology, Inc\\Documents\\Architecture\\Service Discovery Epic.md";
  async function readMD() {
    const data = await fs.readFile(mdfile) 
    return data.toString()
  }

  async function writeMD(mdfile,data) {
    await fs.writeFile(mdfile,data) 
  }
  markdown = await readMD();
  let newmd = p.ExtendToSupportJiraMD(markdown)

  //let newmd = jiraCodeToMDTag(markdown);
  let outmdfile = "C:\\Users\\azer-kavod\\OneDrive - Align Technology, Inc\\Documents\\SD2-MD.md";
  writeMD(outmdfile,newmd)
  
  console.log(newmd)
  //let incode = inCodeSection(markdown, 30)
  //console.log("In: " + incode)
  markdown = ""
  await yourFunction();
})();