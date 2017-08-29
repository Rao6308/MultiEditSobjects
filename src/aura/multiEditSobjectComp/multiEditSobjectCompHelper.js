({
    doInithelper : function(component,event) {
        var action = component.get("c.getStringArray");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                component.set("v.sobjects", stringItems); 
            }
        });
        $A.enqueueAction(action);
    },
    onselectlistChangehelper: function(component,event) {
        var selectedval = component.find('selectlist1id').get('v.value');
        var action = component.get("c.getsobjectdata");
        console.log(selectedval);
        action.setParams({
            sobj  :  selectedval
        });
        action.setCallback(this, function(response){
            var state  = response.getState();
            if(state == 'SUCCESS'){
                component.set("v.finalsobj",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    savedatahelper: function(component,event) {
        var saveaction = component.get("c.saverecords");
        var finalsobjects = component.get("v.finalsobj");
        var selectedsobjects = component.find("checkval");
        
        var selectedrecords=new Array();
        for (var idx=0; idx<selectedsobjects.length; idx++) {
            if (selectedsobjects[idx].get("v.value")== true) {
                selectedrecords.push(selectedsobjects[idx].get("v.text"));
            }
        }
        if(selectedrecords.length == 0){
            alert('Select soemthing to edit');
        }
        var finalobjstosave = new Array();
        for (var i=0; i<finalsobjects.length; i++) {
            for(var j=0;j<selectedrecords.length; j++){
                if(finalsobjects[i].Id == selectedrecords[j]){
                    finalobjstosave.push(finalsobjects[i]);
                }
            }
        }
        var selectedListJSON=JSON.stringify(finalobjstosave);
        console.log(selectedListJSON);
        saveaction.setParams({
            saverecords : selectedListJSON
        });
        saveaction.setCallback(this, function(response){
            
            if(saveaction.getState() ==='SUCCESS'){ 
                console.log(response.getReturnValue());
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": response.getReturnValue()
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(saveaction);
    },
    deletedatahelper: function(component,event) {
        var deletaction = component.get("c.deleterecords");
        var selectedsobjects = component.find("checkval");
        var selectedrecords=new Array();
        for (var idx=0; idx<selectedsobjects.length; idx++) {
            if (selectedsobjects[idx].get("v.value")== true) {
                selectedrecords.push(selectedsobjects[idx].get("v.text"));
            }
        }
        deletaction.setParams({
            idstodelete : selectedrecords
        });
        deletaction.setCallback(this, function(response){
            $A.get('e.force:refreshView').fire();
            console.log(response.getReturnValue());
        });
        $A.enqueueAction(deletaction);
        
    }
}
 })