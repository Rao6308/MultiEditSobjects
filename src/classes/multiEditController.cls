public class multiEditController {
    Public Static List<SObject> existingRecordList = new List<SObject>();
    Public Static List<sobjWrapper> sList = new List<sobjWrapper>();
    Public Static string sobjectName_temp = '';
    @AuraEnabled
    public static List<String> getStringArray() {
        String[] arrayItems = new String[]{}; 
            for(Schema.SObjectType f : Schema.getGlobalDescribe().Values())
        {
            arrayItems.add(f.getDescribe().getName());
        }
        arrayItems.sort();
        return arrayItems;
    }
    @AuraEnabled
    public static List<sobject> getsobjectdata(String sobj) {
        if(sobj == null){
            throw new AuraHandledException('Malformed parameters');
        }
        String queryString = 'select id,name from '+sobj;
        existingRecordList = Database.query(queryString);
        return existingRecordList;
    }
    @AuraEnabled
    public static String saverecords(String saverecords) {
        List<SObject> sObjectsToUpdate = new List<SObject>();
        
        List<sobjWrapper> sobjval = sobjWrapper.parse(saverecords);
        for(sobjwrapper sob : sobjval){
            Sobject s = sob.Id.getSObjectType().newSObject(sob.Id);
            s.put('Name',sob.Name);
            sObjectsToUpdate.add(s);
        }
        Database.SaveResult[] DR_Updates = Database.update(sObjectsToUpdate,false);
        for (Database.SaveResult dr: DR_Updates) {
   			if (dr.isSuccess()) {
                return 'Account Id: '+dr.getId()+ ' Saved successfully';
            }
        }
        return null;
    }
    @AuraEnabled
    public static String deleterecords(List<Id> idstodelete) {
        Database.DeleteResult[] DR_Dels = Database.delete(idstodelete, false);
        for (Database.DeleteResult dr: DR_Dels) {
   			if (dr.isSuccess()) {
        		return 'Ids '+ idstodelete + ' deleted';
            }
            else{
                return 'Delete Failed.';
            }
        }
    return null;
    }
    
}