using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class RecipeModel
    {
        public int Id { get; set; }
        public int MaxSpeed { get; set; }
        public string Name { get; set; }
        public int barley { get; set; }
        public int hops { get; set; }
        public int malt { get; set; }
        public int wheat { get; set; }
        public int yeast { get; set; }

        public RecipeModel(int id, int maxSpeed, string name, int barley, int hops, int malt, int wheat, int yeast)
        {
            Id = id;
            MaxSpeed = maxSpeed;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            this.barley = barley;
            this.hops = hops;
            this.malt = malt;
            this.wheat = wheat;
            this.yeast = yeast;
        }
    }
}
