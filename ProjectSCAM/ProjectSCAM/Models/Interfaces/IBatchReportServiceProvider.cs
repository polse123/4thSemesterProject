namespace ProjectSCAM.Models.Logic {
    public interface IBatchReportServiceProvider {
        void ConvertToPdf(string batchId);
        void GenerateFile(float batchID, float productType, int aProduct, int dProduct, BatchValueCollection batchValues);
    }
}