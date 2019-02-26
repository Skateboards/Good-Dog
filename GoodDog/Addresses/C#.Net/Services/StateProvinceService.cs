using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class StateProvinceService : IStateProvinceService
    {
        private IDataProvider _dataProvider;

        public StateProvinceService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public List<StateProvince> Get()
        {
            List<StateProvince> list = null;
            string procName = "[dbo].[StateProvinces_SelectAll]";
            _dataProvider.ExecuteCmd(procName
              , inputParamMapper: delegate (SqlParameterCollection paramCollection) { }
              , singleRecordMapper: delegate (IDataReader reader, short set)
              {
                  Sabio.Models.Domain.StateProvince stateProvince = new StateProvince();

                  int startingIndex = 0;
                  stateProvince.Id = reader.GetInt32(startingIndex++);
                  stateProvince.CountryId = reader.GetSafeInt32(startingIndex++);
                  stateProvince.Code = reader.GetSafeString(startingIndex++);
                  stateProvince.CountryRegionCode = reader.GetSafeString(startingIndex++);
                  stateProvince.IsOnlyStateProvinceFlag = reader.GetSafeBool(startingIndex++);
                  stateProvince.Name = reader.GetSafeString(startingIndex++);
                  stateProvince.TerritoryID = reader.GetSafeInt32(startingIndex++);
                  stateProvince.Rowguid = reader.GetSafeGuid(startingIndex++);
                  stateProvince.ModifiedDate = reader.GetSafeDateTime(startingIndex++);

                  if (list == null)
                  {
                      list = new List<StateProvince>();
                  }

                  list.Add(stateProvince);
              }
              );
            return list;
        }
    }
}
