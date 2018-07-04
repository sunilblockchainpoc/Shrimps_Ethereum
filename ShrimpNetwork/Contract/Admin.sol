pragma solidity ^0.4.21;
contract Admin{
    
    uint REGISTER_COUNT=0;
    uint BATCH_COUNT=0;
    uint POND_ID=0;
    uint STORAGE_ID=0;
    uint SKU_INDEX=0;
    uint INDEX=0;
    
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

     struct SKU_Details{
        string SKU_code;
        string SKU_size;
        PrawnType prawn_type;
        string description;
        string SKU_createdby;
        uint SKU_createddate;
        string SKU_ReportName;
        string SKU_ReportHash;
    }
   
   struct StorageUnit{
   string storageUnitName;
   string storageUnitCapacity;
   string storageUnitLocation;
   }
    
   struct Register{
        ParticipantType participantType;
        string firstName;
        string lastName;
        string description;
        address publicKey;
        string email;
        uint phone;
    }
    
    struct Pond{
        
        string name;
        string location;
        string description;
    }
    
  
    event SKUCreated (uint SKU_INDEX,string SKU_code,string SKU_ReportName,string SKU_ReportHash);
    event RegisterUserEvent(string participantID,string firstName,string lastName,ParticipantType participantType);
    event StorageUnitCreatedEvent(uint storageUnitId,string storageUnitName);
    event PondCreatedEvent(uint pondID,string participantID);
    event PondCheckEvent(string participantID,string message);
   

    mapping(string=>Register) RegisterMap;
    mapping(uint=>Pond) PondMap;
    mapping(uint=>string) FarmerMap;
    mapping(uint=>StorageUnit) StorageMap;
    mapping(uint => SKU_Details) SKU_DetailsMap;

    //Method to Register a New User=============================================================================================
    function registerUser(string _participantID,ParticipantType _participantType,string _firstName,string _lastName,string _description,address _publicKey,string _email,uint _phone){
        
        require(bytes(_participantID).length>0 && bytes(_firstName).length>0 && bytes(_lastName).length>0 && bytes(_description).length>0 && bytes(_email).length>0);
        require(_participantType>=ParticipantType(0) && _participantType<=ParticipantType(7));
        require(_publicKey!=address(0));
        require(_phone>0);
            
        RegisterMap[_participantID]=Register(_participantType,_firstName,_lastName,_description,_publicKey,_email,_phone);
        REGISTER_COUNT++;
        RegisterUserEvent(_participantID,_firstName,_lastName,_participantType);
    }
    
    //Method to retrieve Core User Details==========================================================================================
    function viewUserDetails(string _participantID) constant returns(ParticipantType,string,string,string,uint){
        
        return(RegisterMap[_participantID].participantType,RegisterMap[_participantID].firstName,RegisterMap[_participantID].lastName,RegisterMap[_participantID].email,RegisterMap[_participantID].phone);
    }
    
    //Method to retrieve Additional User Details=====================================================================================
    function viewAdditionalUserDetails(string _participantID) constant returns(string,address){
        
        return(RegisterMap[_participantID].description,RegisterMap[_participantID].publicKey);
    }

     function getUserCount() constant returns(uint){
        
        return REGISTER_COUNT;
    }
    
    
    //Method to Create a New Pond=====================================================================================================
    function createPond(string _participantID,string _name,string _location,string _description){
        
        require(bytes(_name).length>0 && bytes(_location).length>0 && bytes(_description).length>0);
        
        if(bytes(RegisterMap[_participantID].firstName).length>0 && RegisterMap[_participantID].participantType==ParticipantType(0)){
            
            PondMap[POND_ID]=Pond(_name,_location,_description);
            FarmerMap[POND_ID]=_participantID;
            PondCreatedEvent(POND_ID,_participantID);
            POND_ID++;
        }
        else{
           
                PondCheckEvent(_participantID,"is NOT REGISTERED or NOT A FARMER");
        }
    }
    
    //Method to retrieve Pond Details==================================================================================================
    function viewPondDetails(uint _pondID) constant returns(string,string,string){
        
        return(PondMap[_pondID].name,PondMap[_pondID].location,PondMap[_pondID].description);
    }

    function getPondFromFarmerId(string _farmerId)constant returns(uint){
        
    for(uint i=0;i<POND_ID;i++){
       if(keccak256(_farmerId)==keccak256(FarmerMap[i])){
           return i;
       }
       }
    }
    
    
    //Method to get the Total Number of Ponds created==================================================================================
    function getPondCount() constant returns(uint){
        
        return POND_ID;
    }
    
    //Method create storage unit=======================================================================================================
     function createStorageUnit(string _storageUnitName,string _storageUnitCapacity,string _storageUnitLocation){
     StorageMap[STORAGE_ID]=StorageUnit(_storageUnitName,_storageUnitCapacity,_storageUnitLocation);
     StorageUnitCreatedEvent(STORAGE_ID,_storageUnitName);
     STORAGE_ID++;
     }
    //Method get storage unit==========================================================================================================
     function getStorageUnit(uint _storageUnitId)constant returns(string,string,string){
     return(StorageMap[_storageUnitId].storageUnitName,StorageMap[_storageUnitId].storageUnitCapacity,
            StorageMap[_storageUnitId].storageUnitLocation);
    }
    //Method get storageUnit count
    function getStorageUnitCount()constant returns(uint){
    return STORAGE_ID; 
    }
      //Method create SKU 
    //==================================================================================================================================
       function createSKU(string SKU_code, string SKU_size, PrawnType prawn_type, string description, string SKU_createdby,
     uint SKU_createddate,string _skuReportName,string _skuReportHash)
    {
        SKU_DetailsMap[SKU_INDEX]=SKU_Details(SKU_code,SKU_size,prawn_type,description,SKU_createdby,
        SKU_createddate,_skuReportName,_skuReportHash);
        SKUCreated (SKU_INDEX,SKU_code,_skuReportName,_skuReportHash);
        SKU_INDEX++;
    }

    // Method get SKUdetails
    //==================================================================================================================================
      /* Method name : getSKU

         Description : This method is used to get the SKU details for the given index

         */  function getSKUdetails(uint SKU_INDEX )public constant returns(string SKU_code,string SKU_size,PrawnType prawn_type,string        description,string SKU_createdby,uint SKU_createddate,string SKU_ReportName,string SKU_ReportHash)
            {
          INDEX=SKU_INDEX;
         return(
          SKU_DetailsMap[INDEX].SKU_code,
          SKU_DetailsMap[INDEX].SKU_size,
          SKU_DetailsMap[INDEX].prawn_type,
          SKU_DetailsMap[INDEX].description,
          SKU_DetailsMap[INDEX].SKU_createdby,
          SKU_DetailsMap[INDEX].SKU_createddate,
          SKU_DetailsMap[INDEX].SKU_ReportName,
          SKU_DetailsMap[INDEX].SKU_ReportHash);
    }

     //Method Get SKU COUNT
     //=================================================================================================================================
        function getSKUCount() constant returns(uint SKU)
    {
        return SKU_INDEX; 
    }
     
   }
