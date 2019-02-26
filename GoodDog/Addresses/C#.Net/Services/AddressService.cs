using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Models.Requests;
using Sabio.Models;

namespace Sabio.Services
{
    public class AddressService : IAddressService
    {
        private IDataProvider _dataProvider;

        private static Address MapAddress(IDataReader reader)
        {
            Address address = new Address();
            address.StateProvince = new StateProvince();
            int startingIndex = 0;
            address.Id = reader.GetInt32(startingIndex++);
            address.LineOne = reader.GetSafeString(startingIndex++);
            address.LineTwo = reader.GetSafeString(startingIndex++);
            address.City = reader.GetSafeString(startingIndex++);
            address.StateProvince.Id = reader.GetInt32(startingIndex++);
            address.StateProvince.CountryId = reader.GetInt32(startingIndex++);
            address.StateProvince.Code = reader.GetSafeString(startingIndex++);
            address.StateProvince.CountryRegionCode = reader.GetSafeString(startingIndex++);
            address.StateProvince.IsOnlyStateProvinceFlag = reader.GetSafeBool(startingIndex++);
            address.StateProvince.Name = reader.GetSafeString(startingIndex++);
            address.StateProvince.TerritoryID = reader.GetInt32(startingIndex++);
            address.StateProvince.Rowguid = reader.GetSafeGuid(startingIndex++);
            address.StateProvince.ModifiedDate = reader.GetSafeDateTime(startingIndex++);
            address.PostalCode = reader.GetSafeString(startingIndex++);
            address.DateCreated = reader.GetSafeDateTime(startingIndex++);
            address.DateModified = reader.GetSafeDateTime(startingIndex++);
            address.UserId = reader.GetSafeInt32(startingIndex++);
            return address;
        }

        public AddressService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public int Add(AddressAddRequest data, int userId)
        {
            if (data == null)
            {
                throw new ArgumentNullException("Parameter data is required");
            }
            int addressId = 0;
            string storedProc = "[dbo].[Addresses_Insert]";

            _dataProvider.ExecuteNonQuery(storedProc,

                delegate (SqlParameterCollection sqlParams)
                {

                    sqlParams.AddWithValue("@LineOne", data.LineOne);
                    sqlParams.AddWithValue("@LineTwo", data.LineTwo);
                    sqlParams.AddWithValue("@City", data.City);
                    sqlParams.AddWithValue("@StateId", data.StateId);
                    sqlParams.AddWithValue("@PostalCode", data.PostalCode);
                    sqlParams.AddWithValue("@UserId", userId);

                    SqlParameter idParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idParameter.Direction = System.Data.ParameterDirection.Output;

                    sqlParams.Add(idParameter);

                }, returnParameters: delegate (SqlParameterCollection param)
                {
                    Int32.TryParse(param["@Id"].Value.ToString(), out addressId);
                }
                );
            return addressId;
        }

        public void Update(AddressUpdateRequest data, int userId)
        {
            if (data == null)
            {
                throw new ArgumentNullException("Parameter data is required");
            }
            string storedProc = "[dbo].[Addresses_Update]";

            _dataProvider.ExecuteNonQuery(storedProc,

                delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", data.Id);
                    sqlParams.AddWithValue("@LineOne", data.LineOne);
                    sqlParams.AddWithValue("@LineTwo", data.LineTwo);
                    sqlParams.AddWithValue("@City", data.City);
                    sqlParams.AddWithValue("@StateId", data.StateId);
                    sqlParams.AddWithValue("@PostalCode", data.PostalCode);
                });
        }

        public Sabio.Models.Domain.Address Get(int id)
        {
            Sabio.Models.Domain.Address address = null;
            string procName = "[dbo].[Addresses_SelectById]";
            Action<SqlParameterCollection> inputParamMapper = delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            };
            Action<IDataReader, short> recordMapper = delegate (IDataReader reader, short set)
            {
                address = MapAddress(reader);
            };
            _dataProvider.ExecuteCmd(procName, inputParamMapper, recordMapper);

            return address;
        }

        public Sabio.Models.Domain.Address GetByUserId(int userId)
        {
            Sabio.Models.Domain.Address address = null;
            string procName = "[dbo].[Addresses_SelectByUserId]";
            Action<SqlParameterCollection> inputParamMapper = delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);
            };
            Action<IDataReader, short> recordMapper = delegate (IDataReader reader, short set)
            {
                address = MapAddress(reader);
            };
            _dataProvider.ExecuteCmd(procName, inputParamMapper, recordMapper);

            return address;
        }

        public Paged<Address> Get(int pageIndex, int pageSize)
        {
            List<Sabio.Models.Domain.Address> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Addresses_SelectByPage]";
            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Address address = MapAddress(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetInt32(17);
                    }
                    if (list == null)
                    {
                        list = new List<Sabio.Models.Domain.Address>();
                    }
                    list.Add(address);
                }
                );
            Paged<Address> page = null;
            if (list != null)
            {
                page = new Paged<Address>(list, pageIndex, pageSize, totalCount);
            }

            return page;
        }

        public void Delete(int addressId)
        {
            string storedProc = "[dbo].[Addresses_Delete]";

            _dataProvider.ExecuteNonQuery(storedProc,

                delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", addressId);
                });
        }
    }
}
