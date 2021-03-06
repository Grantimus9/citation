module.exports = {
  type: "regex",

  // normalize all cites to an ID, with and without subsections
  id: function(cite) {
    return ["dc-code", cite.title, cite.section]
      .concat(cite.subsections)
      .join("/");
  },

  // field to calculate parents from
  parents_by: "subsections",

  patterns: function(context) {
    // only apply this regex if we're confident that relative citations refer to the DC Code
    if (context.source == "dc_code") {
      return [

        // § 32-701
        // § 32-701(4)
        // § 3-101.01
        // § 1-603.01(13)
        // § 1- 1163.33
        // § 1 -1163.33
        // section 16-2326.01
        {
          regex:
            "(?:section(?:s)?|§+)\\s+(\\d+A?)" +
            "\\s?\\-\\s?" +
            "([\\w\\d]+(?:\\.?[\\w\\d]+)?)" +  // section identifier, letters/numbers/dots
            "((?:\\([^\\)]+\\))*)", // any number of adjacent parenthesized subsections

          fields: ["title", "section", "subsections"],

          processor: function(captures) {
            var title = captures.title;
            var section = captures.section;
            var subsections = [];
            if (captures.subsections)
              subsections = captures.subsections.split(/[\(\)]+/).filter(function(x) {return x});

            return {
              title: title,
              section: section,
              subsections: subsections
            };
          }
        }
      ];
    }

    // absolute cites
    else {
      return [

        // D.C. Official Code 3-1202.04
        // D.C. Official Code § 3-1201.01
        // D.C. Official Code §§ 38-2602(b)(11)
        // D.C. Official Code § 3- 1201.01
        // D.C. Official Code § 3 -1201.01
        {
          regex:
            "D\\.?C\\.? (?:Official )?Code\\s+" + // absolute identifier
            "(?:§+\\s+)?(\\d+A?)" +            // optional section sign, plus title
            "\\s?\\-\\s?" +
            "([\\w\\d]+(?:\\.?[\\w\\d]+)?)" +      // section identifier, letters/numbers/dots
            "((?:\\([^\\)]+\\))*)", // any number of adjacent parenthesized subsections

          fields: ["title", "section", "subsections"],

          processor: function(captures) {
            var title = captures.title;
            var section = captures.section;

            var subsections = [];
            if (captures.subsections) subsections = captures.subsections.split(/[\(\)]+/).filter(function(x) {return x});

            return {
              title: title,
              section: section,
              subsections: subsections
            };
          }
        }
      ];
    }
  }
};
