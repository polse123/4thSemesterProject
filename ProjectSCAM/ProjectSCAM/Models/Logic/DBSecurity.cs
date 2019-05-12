using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class DBSecurity
    {
        /// <summary>
        /// The length of a timestamp.
        /// </summary>
        private readonly int TIMESTAMP_LENGTH = 23;

        /// <summary>
        /// The length of an expiration date timestamp.
        /// </summary>
        private readonly int EXPIRATION_DATE_LENGTH = 10;

        /// <summary>
        /// The minimum year allowed in timestamps.
        /// </summary>
        private readonly int MINIMUM_YEAR = 2019;

        /// <summary>
        /// Chars illegal in input strings.
        /// </summary>
        private readonly char[] ILLEGAL_CHARS = new char[] { '@', '.', ',', ':', ';', '\'', '-', '_', '/', '\\' };

        /// <summary>
        /// Chars allowed in timestamps.
        /// </summary>
        private readonly char[] LEGAL_FOR_TIMESTAMPS = new char[] { '/', '-', ':' };

        /// <summary>
        /// Chars allowed in expiration dates.
        /// </summary>
        private readonly char[] LEGAL_FOR_EXPIRATION_DATES = new char[] { '/', '-' };

        /// <summary>
        /// Chars allowed for names.
        /// </summary>
        private readonly char[] LEGAL_FOR_NAMES = new char[] { '-' };

        /// <summary>
        /// Chars allowed for email adresses.
        /// </summary>
        private readonly char[] LEGAL_FOR_EMAILS = new char[] { '@', '.' };

        /// <summary>
        /// Chars allowed for ip's.
        /// </summary>
        private readonly char[] LEGAL_FOR_IPS = new char[] { '.' };

        /// <summary>
        /// Chars allowed for text.
        /// </summary>
        private readonly char[] LEGAL_FOR_TEXT = new char[] { '.', ',', '-' };

        /// <summary>
        /// Very illegal string.
        /// </summary>
        private readonly string VERY_ILLEGAL = "--";

        /// <summary>
        /// Constructor.
        /// </summary>
        public DBSecurity() { }

        public bool CheckInput(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            foreach (char c in ILLEGAL_CHARS)
            {
                if (input.Contains(c))
                {
                    return false;
                }
            }
            return true;
        }

        public bool CheckInputs(string[] inputs)
        {
            /*foreach (string input in inputs)
            {
                bool result = CheckInput(input);
                if (!result)
                {
                    return false;
                }
            }*/
            return true;
        }

        public bool CheckTimestamp(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            if (input.Length == TIMESTAMP_LENGTH)
            {
                foreach (char c in ILLEGAL_CHARS)
                {
                    if (!LEGAL_FOR_TIMESTAMPS.Contains(c))
                    {
                        if (input.Contains(c))
                        {
                            return false;
                        }
                    }
                }
                try
                {
                    int.TryParse(input.Substring(6, 4), out int year);
                    if (year >= MINIMUM_YEAR)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch (Exception)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public bool CheckExpirationDate(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            if (input.Length == EXPIRATION_DATE_LENGTH)
            {
                foreach (char c in ILLEGAL_CHARS)
                {
                    if (!LEGAL_FOR_TIMESTAMPS.Contains(c))
                    {
                        if (input.Contains(c))
                        {
                            return false;
                        }
                    }
                }
                try
                {
                    int.TryParse(input.Substring(6, 4), out int year);
                    if (year >= MINIMUM_YEAR)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch (Exception)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public bool CheckName(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            foreach (char c in ILLEGAL_CHARS)
            {
                if (input.Contains(c))
                {
                    if (!LEGAL_FOR_NAMES.Contains(c))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public bool CheckEmail(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            foreach (char c in ILLEGAL_CHARS)
            {
                if (input.Contains(c))
                {
                    if (!LEGAL_FOR_EMAILS.Contains(c))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public bool CheckNumber(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }

            char[] chars = input.ToArray();

            foreach (char c in chars)
            {
                if (!char.IsDigit(c))
                {
                    return false;
                }
            }
            return true;
        }

        public bool CheckIp(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            foreach (char c in ILLEGAL_CHARS)
            {
                if (input.Contains(c))
                {
                    if (!LEGAL_FOR_IPS.Contains(c))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public bool CheckText(string input)
        {
            if (input.Contains(VERY_ILLEGAL))
            {
                return false;
            }
            foreach (char c in ILLEGAL_CHARS)
            {
                if (input.Contains(c))
                {
                    if (!LEGAL_FOR_TEXT.Contains(c))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public bool CheckMonthAndYear(string month, string year)
        {
            if (month.Contains(VERY_ILLEGAL) || year.Contains(VERY_ILLEGAL))
            {
                return false;
            }

            char[] monthC = month.ToArray();
            char[] yearC = year.ToArray();

            foreach (char[] chars in new char[][] { monthC, yearC })
            {
                foreach (char c in chars)
                {
                    if (!char.IsDigit(c))
                    {
                        return false;
                    }
                }
            }

            if (month.Length == 2 && year.Length == 4)
            {
                return true;
            }
            else return false;
        }

        /// <summary>
        /// Removes batch values where the timestamp contains illegal chars.
        /// </summary>
        /// <param name="values"></param>
        public void RemoveBadBatchValues(IList<KeyValuePair<string, double>>[] values)
        {
            foreach (IList<KeyValuePair<string, double>> list in values)
            {
                foreach (KeyValuePair<string, double> pair in list)
                {
                    if (!CheckTimestamp(pair.Key))
                    {
                        list.Remove(pair);
                    }
                }
            }
        }
    }
}
