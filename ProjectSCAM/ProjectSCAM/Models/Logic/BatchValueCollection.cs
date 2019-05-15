using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchValueCollection
    {
        public IList<KeyValuePair<string, double>> TemperatureValues { get; set; }
        public IList<KeyValuePair<string, double>> HumidityValues { get; set; }
        public IList<KeyValuePair<string, double>> VibrationValues { get; set; }

        public BatchValueCollection()
        {
            TemperatureValues = new List<KeyValuePair<string, double>>();
            HumidityValues = new List<KeyValuePair<string, double>>();
            VibrationValues = new List<KeyValuePair<string, double>>();
        }

        public BatchValueCollection(List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationValues)
        {
            TemperatureValues = temperatureValues;
            HumidityValues = humidityValues;
            VibrationValues = vibrationValues;
        }

        /// <summary>
        /// Retruns an array with lists of values.
        /// Index 1 is temperature values.
        /// Index 2 is humidity values.
        /// Index 3 is vibration values.
        /// </summary>
        /// <returns></returns>
        public IList<KeyValuePair<string, double>>[] ToArray()
        {
            IList<KeyValuePair<string, double>>[] array = { TemperatureValues, HumidityValues, VibrationValues };
            return array;
        }
    }
}
