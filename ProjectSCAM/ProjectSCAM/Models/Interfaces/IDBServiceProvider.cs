using System.Collections.Generic;

namespace ProjectSCAM.Models.Logic {
    public interface IDBServiceProvider {
        bool EditCustomerName(int customerId, string newName);
        bool EditMachine(int machineId, string ipAddress, string description, int nameSpaceIndex, string amountNode, string stateNode, string defectNode, string acceptableNode, string amountToProduceNode, string machSpeedNode, string temperatureNode, string humidityNode, string vibrationNode, string stopreasonNode, string batchIdNode, string barleyNode, string hopsNode, string maltNode, string wheatNode, string yeastNode, string maintenanceTriggerNode, string maintenanceCounterNode);
        bool EditPriority(int queueId, int priority);
        bool MakeUserInactive(int userid);
        bool RecallBatch(int batchId);
        bool RegisterBatch(int acceptableProducts, int defectProducts, string timestampStart, string timestampEnd, string expirationDate, bool succeeded, double performance, double quality, double availability, int speed, int beerId, int machine, IList<KeyValuePair<string, double>> temperatureValues, IList<KeyValuePair<string, double>> humidityValues, IList<KeyValuePair<string, double>> vibrationsValues);
        AlarmModel RegisterBatchAndAlarm(int acceptableProducts, int defectProducts, string timestampStart, string timestampEnd, string expirationDate, bool succeeded, double performance, double quality, double availability, int speed, int beerId, int machine, IList<KeyValuePair<string, double>> temperatureValues, IList<KeyValuePair<string, double>> humidityValues, IList<KeyValuePair<string, double>> vibrationsValues, string alarmTimestamp, int stopReason);
        bool RegisterCustomer(string customerName);
        bool RegisterIntoBatchQueue(int queueid, int priority, int amount, int speed, int beerid);
        bool RegisterMachine(string ipAddress, string description, int nameSpaceIndex, string amountNode, string stateNode, string defectNode, string acceptableNode, string amountToProduceNode, string machSpeedNode, string temperatureNode, string humidityNode, string vibrationNode, string stopreasonNode, string batchIdNode, string barleyNode, string hopsNode, string maltNode, string wheatNode, string yeastNode, string maintenanceTriggerNode, string maintenanceCounterNode);
        bool RegisterUser(string username, string password, string firstName, string lastName, string email, string phoneNumber, int userType);
        bool RemoveFromBatchQueue(int queueId);
        AlarmModel RetrieveAlarm(int alarmId);
        IList<AlarmModel> RetrieveAlarms();
        IList<AlarmModel> RetrieveAlarms(int amount);
        IList<AlarmModel> RetrieveAlarmsByMachine(int machineId);
        IList<AlarmModel> RetrieveAlarmsByMonth(string month, string year);
        IList<AlarmModel> RetrieveAlarmsByStopReason(int stopReason);
        BatchModel RetrieveBatch(int batchId);
        IList<BatchModel> RetrieveBatches(bool succeededOnly);
        IList<BatchModel> RetrieveBatchesByAmount(int amount, bool succeededOnly);
        IList<BatchModel> RetrieveBatchesByMachine(int machine, bool succeededOnly);
        IList<BatchModel> RetrieveBatchesByMonth(string month, string year, bool succeededOnly);
        IList<BatchModel> RetrieveBatchesByRecipe(int beerId, bool succeededOnly);
        BatchValueCollection RetrieveBatchValues(int batchId);
        IList<BeerModel> RetrieveBeers(int batchId);
        IList<CustomerModel> RetrieveCustomers();
        IList<BatchQueueModel> RetrieveFromBatchQueue();
        IList<MachineModel> RetrieveMachines();
        int RetrieveMaxSpeed(int id);
        IList<RecipeModel> RetrieveRecipes();
        IList<StopReasonModel> RetrieveStopReasons();
        IList<AlarmModel> RetrieveUnhandledAlarms();
        IList<AlarmModel> RetrieveUnhandledAlarms(int machineId);
        UserModel RetrieveUser(int id, bool activeOnly);
        UserModel RetrieveUser(string username, string password, bool activeOnly);
        IList<UserModel> RetrieveUsers(bool activeOnly);
        IList<UserType> RetrieveUserTypes();
        bool SetAlarmHandler(int userId, int alarmId);
        bool SetBeerAsDefect(int productNumber, int batchId);
        bool SetBeerAsDefect(int productNumber, int batchId, int acceptableProducts, int defectProducts);
        bool SetSale(int batchId, int customerId);
    }
}