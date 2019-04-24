using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchValueCollection
    {
        public List<KeyValuePair<string, double>> TemperatureValues { get; set; }
        public List<KeyValuePair<string, double>> HumidityValues { get; set; }
        public List<KeyValuePair<string, double>> VibrationValues { get; set; }

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
    }
}
