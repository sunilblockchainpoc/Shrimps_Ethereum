pragma solidity ^0.4.21;
contract Procurement{
    
   
    uint BATCH_COUNT=0;
    
    
    enum ParticipantType{
        
        FARMER,
        PROCUREMENT,
        PRODUCTION,
        INTERNAL_QA,
        EXTERNAL_QA,
        RETAILER,
        IMPORTER,
        EXPORTER
    }
    enum PrawnType{
        
        SCAMPI,
        VANNAMEI,
        BLACK_TIGER
    }
    enum BatchState{
       
        RECEIVED_BY_PROCUREMENT,
        ACKNOWLEDGED_BY_FARMER,
        APPROVED_BY_PROCUREMENT,
        REJECTED_BY_PROCUREMENT,
        RECEIVED_FOR_QA_APPROVAL,
        INTERNAL_QA_APPROVED,
        INTERNAL_QA_REJECT,
        RECEIVED_BY_PRODUCTION,
        APPROVED_BY_PRODUCTION,
        REJECTED_BY_PRODUCTION
    }
    struct BatchStorage{
        uint minimumTemperature;
        uint maximumTemperature;
        string coldStorage;
        string reportName;
        string reportHash;
    }
    struct Batch{
        
        string submittedBy;
        uint batchSize;
        string batchDescription;
        PrawnType prawnType;
        string batchCreatedBy;
        uint batchCreatedDate;
        BatchState batchState;
        BatchStorage batchStorage;
        
    }
    
    event BatchCreatedEvent(string batchNumber,string submittedBy);
    event BatchStateUpdateEvent(string batchNumber,BatchState batchState,string submittedBy,string reportName,string reportHash);
    
    mapping(string=>Batch) BatchMap;
    
    //Method to create a New Batch by the Procurement Team
    function createBatch(string _batchNumber,string _submittedBy,uint _batchSize,string _batchDescription,PrawnType _prawnType,string _batchCreatedBy,uint _batchCreatedDate,
    uint _minimumTemperature, uint _maximumTemperature,string _coldStorage,string _reportName,string _reportHash){
        
        require(bytes(_batchNumber).length>0 && bytes(BatchMap[_batchNumber].submittedBy).length<=0 && bytes(_submittedBy).length>0 && bytes(_batchDescription).length>0 && bytes(_batchCreatedBy).length>0);
        require(_prawnType>=PrawnType(0) && _prawnType<=PrawnType(2));
        require(_batchSize>0 && _batchCreatedDate>0);
        
        BatchMap[_batchNumber]=Batch(_submittedBy,_batchSize,_batchDescription,_prawnType,_batchCreatedBy,_batchCreatedDate,BatchState(0),BatchStorage(_minimumTemperature,_maximumTemperature,
        _coldStorage,_reportName,_reportHash));       //BatchState=Received By Procurement by Default
        BATCH_COUNT++;
        BatchCreatedEvent(_batchNumber,_submittedBy);
    }
    
    //Method to retrieve a Batch's Details
    function getBatchDetails(string _batchNumber) constant returns(string,uint,string,PrawnType,string,uint,BatchState){
        
        return(BatchMap[_batchNumber].submittedBy,BatchMap[_batchNumber].batchSize,BatchMap[_batchNumber].batchDescription,BatchMap[_batchNumber].prawnType,BatchMap[_batchNumber].batchCreatedBy,BatchMap[_batchNumber].batchCreatedDate,BatchMap[_batchNumber].batchState);
    }
    
    function getMoreBatchDetails(string _batchNumber)constant returns(uint acceptedTemperature,uint currentTemperature,
    string coldStorage,string reportName,string reportHash){
        return(BatchMap[_batchNumber].batchStorage.minimumTemperature,BatchMap[_batchNumber].batchStorage.maximumTemperature,
        BatchMap[_batchNumber].batchStorage.coldStorage,BatchMap[_batchNumber].batchStorage.reportName,
        BatchMap[_batchNumber].batchStorage.reportHash);
    }
    
    
    
    //Method to Change the Batch Status by the various Authorities
    function updateBatchState(string _batchNumber,string _participantID,BatchState _batchState,string _reportName,string _reportHash){
        
        require(bytes(_batchNumber).length>0);
        require(_batchState!=BatchState(0) && _batchState!=BatchState(1) && _batchState>=BatchState(2) && _batchState<=BatchState(9));      //Checking the legitimacy of the provided Batch State
        assert(bytes(BatchMap[_batchNumber].submittedBy).length>0);                                                                       //Checking whether the given Batch Number exists
                
        BatchMap[_batchNumber].batchState=_batchState;
        BatchMap[_batchNumber].batchStorage.reportName=_reportName;
        BatchMap[_batchNumber].batchStorage.reportHash=_reportHash;
        BatchStateUpdateEvent(_batchNumber,_batchState,_participantID,_reportName,_reportHash);
    }
    
    //Method: Acknowedged By Farmer
    function acknowledgedByFarmer(string _batchNumber,string _participantID){
        
        require(bytes(_batchNumber).length>0);
        assert(bytes(BatchMap[_batchNumber].submittedBy).length>0);               //Checking whether the given Batch Number exists
                
        BatchMap[_batchNumber].batchState=BatchState(1);
        BatchStateUpdateEvent(_batchNumber,BatchMap[_batchNumber].batchState,_participantID,"","");
    }
    

    //Method to get the Total Number of Batches created by the Procurement Team
    function getBatchCount() constant returns(uint){
        
        return BATCH_COUNT;
    }
    
}