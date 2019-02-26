using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ActivityEntryMe
{
    public class AEMeUpdateNotesPhotoRequest : IModelIdentifier
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int? Id { get; set; }
        [StringLength(maximumLength: 1000)]
        public string Notes { get; set; }
        [StringLength(maximumLength: 200)]
        public string PhotoUrl { get; set; }
    }
}
