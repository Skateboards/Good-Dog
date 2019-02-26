using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ActivityEntryMe
{
    public class AEMeUpdateStartEndRequest : IModelIdentifier
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int? Id { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int? TimeElapsed { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int? PointsEarned { get; set; }

        public float DistanceTravelled { get; set; }
    }
}
