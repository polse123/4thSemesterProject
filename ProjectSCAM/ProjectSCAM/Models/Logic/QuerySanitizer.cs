using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class QuerySanitizer
    {
        public QuerySanitizer()
        {

        }

        public string SanitizeInput(string input)
        {
            string[] charsToRemove = new string[] { "@", ",", ".", ":", ";", "'", "-" };

            foreach (string c in charsToRemove)
            {
                input = input.Replace(c, string.Empty);
            }

            return input;

            /*string str = new string((from c in input
                                     where char.IsWhiteSpace(c) || char.IsLetterOrDigit(c)
                                     select c
                   ).ToArray());
            input = str;*/
        }

        public string SanitizeTimestamp(string input)
        {
            string[] charsToRemove = new string[] { "@", ",", ".", ";", "'" };

            foreach (string c in charsToRemove)
            {
                input = input.Replace(c, string.Empty);
            }

            return input;
        }
    }
}
