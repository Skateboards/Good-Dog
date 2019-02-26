using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ActivityEntryMe
{
    public class AEMeAddRequest
    {
        [Required]
        public int PetId { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public int ActivityTypeId { get; set; }
    }
}
