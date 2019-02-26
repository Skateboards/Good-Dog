using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ActivityEntryMe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ActivityEntryService : IActivityEntryService
    {
        private IDataProvider _dataProvider;

        private static ActivityEntry MapActivity(IDataReader reader)
        {
            Sabio.Models.Domain.ActivityEntry activity = new ActivityEntry();

            int startingIndex = 0;
            activity.Id = reader.GetInt32(startingIndex++);
            activity.UserId = reader.GetSafeInt32(startingIndex++);
            activity.PetId = reader.GetSafeInt32(startingIndex++);
            activity.IsActive = reader.GetSafeBool(startingIndex++);
            activity.DateStart = reader.GetSafeDateTime(startingIndex++);
            activity.DateEnd = reader.GetSafeDateTime(startingIndex++);
            activity.ActivityTypeId = reader.GetSafeInt32(startingIndex++);
            activity.Value = reader.GetSafeString(startingIndex++);
            activity.TimeElapsed = reader.GetSafeInt32(startingIndex++);
            activity.PointsEarned = reader.GetSafeInt32(startingIndex++);
            activity.ChallengeId = reader.GetSafeInt32(startingIndex++);
            activity.Notes = reader.GetSafeString(startingIndex++);
            activity.PhotoUrl = reader.GetSafeString(startingIndex++);
            activity.DateCreated = reader.GetSafeDateTime(startingIndex++);
            activity.DateModified = reader.GetSafeDateTime(startingIndex++);
            return activity;
        }

        public ActivityEntryService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public List<ActivityEntry> Get()
        {
            List<Sabio.Models.Domain.ActivityEntry> list = null;
            string procName = "[dbo].[ActivityEntries_SelectAll]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ActivityEntry activity = MapActivity(reader);

                    if (list == null)
                    {
                        list = new List<Sabio.Models.Domain.ActivityEntry>();
                    }

                    list.Add(activity);

                }
                );
            return list;
        }

        public ActivityEntry Get(int id)
        {
            Sabio.Models.Domain.ActivityEntry activity = null;
            string procName = "[dbo].[ActivityEntries_SelectById]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@id", id);
                }
                , singleRecordMapper: delegate (IDataReader reader, short st)
                {
                    activity = MapActivity(reader);
                }
                );
            return activity;
        }

        public Paged<ActivityEntry> Get(int pageIndex, int pageSize)
        {
            List<ActivityEntry> list = null;
            int totalCount = 0;
            String procName = "[dbo].[ActivityEntries_SelectByPage]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ActivityEntry activity = MapActivity(reader);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetInt32(14);
                    }
                    if (list == null)
                    {
                        list = new List<ActivityEntry>();
                    }

                    list.Add(activity);
                }
                );
            Paged<ActivityEntry> page = null;
            if (list != null)
            {
                page = new Paged<ActivityEntry>(list, pageIndex, pageSize, totalCount);
            }
            return page;

        }

        public List<ActivityNecessity> GetNecessity()
        {
            List<ActivityNecessity> list = null;
            string procName = "[dbo].[ActivityEntries_GetAllNecessities]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ActivityNecessity activity = ActivityNessityMapper(reader);

                    if (list == null)
                    {
                        list = new List<ActivityNecessity>();
                    }

                    list.Add(activity);

                }
                );
            return list;
        }

        private static ActivityNecessity ActivityNessityMapper(IDataReader reader)
        {
            ActivityNecessity activity = new ActivityNecessity();

            int startingIndex = 0;
            activity.Id = reader.GetInt32(startingIndex++);
            activity.IsActive = reader.GetSafeBool(startingIndex++);
            activity.DateStart = reader.GetSafeDateTime(startingIndex++);
            activity.DateEnd = reader.GetSafeDateTime(startingIndex++);
            activity.Value = reader.GetSafeString(startingIndex++);
            activity.TimeElapsed = reader.GetSafeInt32(startingIndex++);
            activity.PointsEarned = reader.GetSafeInt32(startingIndex++);
            activity.Notes = reader.GetSafeString(startingIndex++);
            activity.PhotoUrl = reader.GetSafeString(startingIndex++);
            activity.ActivityTitle = reader.GetSafeString(startingIndex++);
            activity.ChallengeName = reader.GetSafeString(startingIndex++);
            activity.PetName = reader.GetSafeString(startingIndex++);
            activity.PetPhoto = reader.GetSafeString(startingIndex++);
            activity.UserName = reader.GetSafeString(startingIndex++);
            activity.DogMoodBefore = reader.GetSafeString(startingIndex++);
            activity.DogMoodAfter = reader.GetSafeString(startingIndex++);
            activity.ActivityTypeId = reader.GetSafeInt32(startingIndex++);
            activity.ChallengeId = reader.GetSafeInt32(startingIndex++);
            activity.UserId = reader.GetSafeInt32(startingIndex++);
            activity.PetId = reader.GetSafeInt32(startingIndex++);
            activity.SurveyId = reader.GetSafeInt32(startingIndex++);
            return activity;


        }

        public Paged<ActivityNecessity> GetNecessityPage(int pageIndex, int pageSize)
        {
            List<ActivityNecessity> list = null;
            int totalCount = 0;
            String procName = "[dbo].[ActivityEntries_GetNecessityPage]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ActivityNecessity activity = ActivityNessityMapper(reader);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetInt32(21);
                    }
                    if (list == null)
                    {
                        list = new List<ActivityNecessity>();
                    }

                    list.Add(activity);
                }
                );
            Paged<ActivityNecessity> page = null;
            if (list != null)
            {
                page = new Paged<ActivityNecessity>(list, pageIndex, pageSize, totalCount);
            }
            return page;

        }

        public int Insert(ActivityEntryAddRequest data, int userId)
        {
            int ativityEntryId = 0;

            if (data == null)
            {
                throw new ArgumentNullException("This is required");
            }
            string storeProc = "[dbo].[ActivityEntries_Insert]";

            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@UserId", userId);
                    sqlParams.AddWithValue("@PetId", data.PetId);
                    sqlParams.AddWithValue("@IsActive", data.IsActive);
                    sqlParams.AddWithValue("@DateStart", data.DateStart);
                    sqlParams.AddWithValue("@DateEnd", data.DateEnd);
                    sqlParams.AddWithValue("@ActivityTypeId", data.ActivityTypeId);
                    sqlParams.AddWithValue("@Value", data.Value);
                    sqlParams.AddWithValue("@TimeElapsed", data.TimeElapsed);
                    sqlParams.AddWithValue("@PointsEarned", data.PointsEarned);
                    sqlParams.AddWithValue("@ChallengeId", data.ChallengeId);
                    sqlParams.AddWithValue("@Notes", data.Notes);
                    sqlParams.AddWithValue("@PhotoUrl", data.PhotoUrl);

                    SqlParameter idParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idParameter.Direction = System.Data.ParameterDirection.Output;

                    sqlParams.Add(idParameter);
                }
                , returnParameters: delegate (SqlParameterCollection sqlParams)
                {
                    Int32.TryParse(sqlParams["@Id"].Value.ToString(), out ativityEntryId);
                }
                );
            return ativityEntryId;
        }

        public void Update(ActivityEntryUpdateRequest data, int userId)
        {
            if (data == null)
            {
                throw new ArgumentNullException("This is required");
            }
            string storeProc = "[dbo].[ActivityEntries_Update]";

            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", data.Id);
                    sqlParams.AddWithValue("@UserId", userId);
                    sqlParams.AddWithValue("@PetId", data.PetId);
                    sqlParams.AddWithValue("@IsActive", data.IsActive);
                    sqlParams.AddWithValue("@DateStart", data.DateStart);
                    sqlParams.AddWithValue("@DateEnd", data.DateEnd);
                    sqlParams.AddWithValue("@ActivityTypeId", data.ActivityTypeId);
                    sqlParams.AddWithValue("@Value", data.Value);
                    sqlParams.AddWithValue("@TimeElapsed", data.TimeElapsed);
                    sqlParams.AddWithValue("@PointsEarned", data.PointsEarned);
                    sqlParams.AddWithValue("@ChallengeId", data.ChallengeId);
                    sqlParams.AddWithValue("@Notes", data.Notes);
                    sqlParams.AddWithValue("@PhotoUrl", data.PhotoUrl);
                }
                );
        }

        public void Delete(int Id)
        {
            string storeProc = "[dbo].[ActivityEntries_Delete]";

            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {

                    sqlParams.AddWithValue("@Id", Id);

                });
        }

        //new stuff
        public int Insert(AEMeAddRequest data, int userId)
        {
            int sponsorId = 0;
            string storeProc = "[dbo].[ActivityEntries_InsertPetIdActivityId]";
            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@UserId", userId);
                    sqlParams.AddWithValue("@PetId", data.PetId);
                    sqlParams.AddWithValue("@IsActive", data.IsActive);
                    sqlParams.AddWithValue("@ActivityTypeId", data.ActivityTypeId);

                    SqlParameter idParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idParameter.Direction = System.Data.ParameterDirection.Output;

                    sqlParams.Add(idParameter);

                }, returnParameters: delegate (SqlParameterCollection param)
                {
                    Int32.TryParse(param["@Id"].Value.ToString(), out sponsorId);
                }
                );
            return sponsorId;
        }

        public void UpdateStartActivity(AEMeUpdateStartEndRequest data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("A parameter data is required!");
            }
            string storeProc = "[dbo].[ActivityEntries_UpdateStartActivity]";
            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", data.Id);
                    sqlParams.AddWithValue("@TimeElapsed", data.TimeElapsed);
                    sqlParams.AddWithValue("@PointsEarned", data.PointsEarned);
                });
        }

        public void UpdatePauseActivity(AEMeUpdateStartEndRequest data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("A parameter data is required!");
            }
            string storeProc = "[dbo].[ActivityEntries_UpdatePauseActivity]";
            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", data.Id);
                    sqlParams.AddWithValue("@TimeElapsed", data.TimeElapsed);
                    sqlParams.AddWithValue("@PointsEarned", data.PointsEarned);
                    sqlParams.AddWithValue("@DistanceTravelled", data.DistanceTravelled);
                });
        }

        public void UpdateEndActivity(AEMeUpdateStartEndRequest data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("A parameter data is required!");
            }
            string storeProc = "[dbo].[ActivityEntries_UpdateEndActivityV2]";
            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Id", data.Id);
                    sqlParams.AddWithValue("@TimeElapsed", data.TimeElapsed);
                    sqlParams.AddWithValue("@PointsEarned", data.PointsEarned);
                    sqlParams.AddWithValue("@DistanceTravelled", data.DistanceTravelled);
                });
        }

        public void UpdateNotesPhotoActivity(AEMeUpdateNotesPhotoRequest data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("A parameter data is required!");
            }
            string storeProc = "[dbo].[ActivityEntries_UpdateNotesAndPhoto]";
            _dataProvider.ExecuteNonQuery(storeProc
                , delegate (SqlParameterCollection sqlParams)
                {
                    sqlParams.AddWithValue("@Notes", data.Notes);
                    sqlParams.AddWithValue("@PhotoUrl", data.PhotoUrl);
                    sqlParams.AddWithValue("@Id", data.Id);
                });
        }

        public List<ActivityEntry> GetOpenActivities(int userId)
        {
            List<ActivityEntry> list = null;
            string procName = "[dbo].[ActivityEntries_SelectIsActive]";
            _dataProvider.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@UserId", userId);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ActivityEntry activity = MapActivity(reader);

                    if (list == null)
                    {
                        list = new List<ActivityEntry>();
                    }

                    list.Add(activity);

                }
                );
            return list;
        }

        public List<DailyActivityData> GetDateRange(int userId, string start, string end, int timeZoneOffset)
        {
            List<DailyActivityData> list = null;
            string procName = "[dbo].[ActivityEntries_SelectRangebyUserIdV3]";
            _dataProvider.ExecuteCmd(procName
                   , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                   {
                       paramCollection.AddWithValue("@UserId", userId);
                       paramCollection.AddWithValue("@Start", start);
                       paramCollection.AddWithValue("@End", end);
                       paramCollection.AddWithValue("@TimeZoneOffset", timeZoneOffset);
                   }
                   , singleRecordMapper: delegate (IDataReader reader, short set)
                   {
                       DailyActivityData activityData = new DailyActivityData();
                       activityData.TotalWalkTime = reader.GetSafeInt32(0);
                       activityData.TotalDistance = reader.GetSafeDouble(1);
                       activityData.Date = reader.GetSafeDateTime(2);

                       if (list == null)
                       {
                           list = new List<DailyActivityData>();
                       }

                       list.Add(activityData);
                   }
                   );

            return list;
        }

        public Paged<ActivityEntry> GetAllActivitiesForUserId(int userId, int pageIndex, int pageSize)
        {
            Paged<ActivityEntry> response = null;
            List<ActivityEntry> list = null;
            int totalCount = 0;
            string prokName = "[dbo].[ActivityEntries_PageActivitiesForUserId]";
            _dataProvider.ExecuteCmd(prokName
              , inputParamMapper: delegate (SqlParameterCollection paramCollection)
              {
                  paramCollection.AddWithValue("@PageIndex", pageIndex);
                  paramCollection.AddWithValue("@PageSize", pageSize);
                  paramCollection.AddWithValue("@UserId", userId);

              }
              , singleRecordMapper: delegate (IDataReader reader, short set)
              {
                  ActivityEntry activity = new ActivityEntry();
                  activity = MapActivity(reader);
                  if (totalCount == 0)
                  {
                      totalCount = reader.GetSafeInt32(14);
                  }
                  if (list == null)
                  {
                      list = new List<ActivityEntry>();
                  }

                  list.Add(activity);
              }
              );
            if (list != null)
            {
                response = new Paged<ActivityEntry>(list, pageIndex, pageSize, totalCount);
                return response;
            }
            return response;
        }




    }
}
