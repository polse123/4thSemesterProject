using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchQueueModel
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int Speed { get; set; }
        public int BeerId { get; set; }

        public string RecipeName { get; set; }

        public BatchQueueModel(int id, int amount, int speed, int beerId, string recipeName)
        {
            Id = id;
            Amount = amount;
            Speed = speed;
            BeerId = beerId;
            RecipeName = recipeName ?? throw new ArgumentNullException(nameof(recipeName));
        }
    }
}
