using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchQueueModel
    {
        [Required]
        [DefaultValue(1)]
        public int Id { get; set; }
        [Required]
        [DefaultValue(1)]
        public int Priority { get; set; }
        [Required]
        [DefaultValue(1)]
        [Range(1,int.MaxValue)]
        public int Amount { get; set; }
        [Required]
        [DefaultValue(1)]
        [Range(1,600)]
        public int Speed { get; set; }
        [Required]
        [DefaultValue(1)]
        public int BeerId { get; set; }

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
        public BatchQueueModel()
        {

        }
        public void Update()
        {
            ServiceSingleton.Instance.DBService.EditPriority(Id, Priority);
        }
    }
}
