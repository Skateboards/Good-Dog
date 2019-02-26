using System.Collections.Generic;
using Sabio.Models.Domain;

namespace Sabio.Services
{
    public interface IStateProvinceService
    {
        List<StateProvince> Get();
    }
}