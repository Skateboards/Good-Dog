using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;

namespace Sabio.Services
{
    public interface IAddressService
    {
        void Delete(int addressId);
        Address Get(int id);
        Address GetByUserId(int userId);
        Paged<Address> Get(int pageIndex, int pageSize);
        int Add(AddressAddRequest data, int userId);
        void Update(AddressUpdateRequest data, int userId);
    }
}