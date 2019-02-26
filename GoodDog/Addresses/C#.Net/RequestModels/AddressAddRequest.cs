using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Sabio.Models.Requests
{
    public class AddressAddRequest
    {
        [Required]
        [StringLength(maximumLength: 128, MinimumLength = 8)]
        public string LineOne { get; set; }
        public string LineTwo { get; set; }
        [Required]
        [StringLength(maximumLength: 50, MinimumLength = 3)]
        public string City { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int? StateId { get; set; }
        [Required]
        [DataType(DataType.PostalCode)]
        [StringLength(maximumLength: 9, MinimumLength = 5)]
        public string PostalCode { get; set; }
    }
}

