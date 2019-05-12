using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class OEE
    {
        private int acceptableProducts;
        private int producedProducts;
        private int downtime = 0;
        private int operatingTime;
        private int machineSpeedMax;

        public OEE(int acceptableProducts, int defectProducts, DateTime timeStampStart, DateTime timeStampEnd, int machineSpeedMax)
        {
            this.acceptableProducts = acceptableProducts;
            this.producedProducts = acceptableProducts + defectProducts;
            this.operatingTime = CalculateOperatingTime(timeStampStart, timeStampEnd);
            this.machineSpeedMax = machineSpeedMax;
        }

        private int CalculateOperatingTime(DateTime timestampStart, DateTime timestampEnd)
        {

            TimeSpan elapsedTime = timestampEnd - timestampStart;
            int elapsedTimeInt = (int)elapsedTime.TotalSeconds;
            return elapsedTimeInt;
        }

        public double CalculateAvailability()
        {
            return (((double)operatingTime - (double)downtime) / (double)operatingTime);
        }

        public double CalculateQuality()
        {
            double q = 0;
            try
            {

                q = ((double)acceptableProducts / (double)producedProducts);
            }
            catch (System.DivideByZeroException e)
            {
                Console.WriteLine(e);

            }

            return q;
        }

        public double CalculatePerformance()
        {

            return ((double)producedProducts / ((double)operatingTime / 60.0)) / (double)machineSpeedMax;
        }

        public double CalculateOEE()
        {

            return (CalculateAvailability() * CalculateQuality() * CalculatePerformance());


        }
    }
}