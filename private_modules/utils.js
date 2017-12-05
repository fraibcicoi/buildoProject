module.exports = {
    trimWith : function(string, char) {
           
        if (char === "]") char = "\\]";
            
        if (char === "\\") char = "\\\\";
        
            return string.replace(new RegExp(
              "^[" + char + "]+|[" + char + "]+$", "g"
            ), "");
    }
}