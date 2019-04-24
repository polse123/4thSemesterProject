using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchQueueModel
    {
        public int Id { get; }
        public int Priority { get; set; }
        public int Amount { get; }
        public int Speed { get; }
        public int BeerId { get; }

        public string RecipeName { get; }

        public BatchQueueModel(int id, int priority, int amount, int speed, int beerId, string recipeName)
        {
            Id = id;
            Priority = priority;
            Amount = amount;
            Speed = speed;
            BeerId = beerId;
            RecipeName = recipeName ?? throw new ArgumentNullException(nameof(recipeName));
        }
    }
}
