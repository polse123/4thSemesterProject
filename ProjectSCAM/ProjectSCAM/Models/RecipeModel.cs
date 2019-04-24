using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class RecipeModel
    {
        public int Id { get; }
        public int MaxSpeed { get; }
        public string Name { get; }
        public int barley { get; }
        public int hops { get; }
        public int malt { get; }
        public int wheat { get; }
        public int yeast { get; }

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
