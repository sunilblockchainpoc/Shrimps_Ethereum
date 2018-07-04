pragma solidity ^0.4.21;
    contract Production {
   
    uint SALEBLE_UNIT_ID = 0;
    uint PACKAGE_ID = 1;
    uint SKU_Id=0;
    uint[] saleableUnit;
   
    //structure for the SKU details
      enum PrawnType{
        SCAMPI,VANNAMAEI,BLACK_TIGER
    }
   
    event SaleableUnitCreated (uint SALEBLE_UNIT_ID,string SKU_code,string BatchId);
    event UpdatePackageId(string message,uint packageId);
    event PackageCreated (uint PACKAGE_ID,string Quantity);
   
   
    //structure for Saleble unit
    struct Saleable_unit
    {
       string SKU_code;
       string BatchId;
       uint packageId;
       string saleble_unit_createdby;
       uint saleble_unit_createddate;
    }

    //structure for Package Details
    struct Packaging_detail
    {
       string Quantity;
       string packaging_createdby;
       uint packaging_createddate;
       uint[] saleableUnits;
    }

    mapping(uint => Saleable_unit) SalebleUnit;
    mapping(uint => Packaging_detail)Packagingdetails;
    mapping(uint => string)SKU_IdBatchMap;
   
 /* Method name : createSKU

  */

    
function createSaleable(string SKU_code,string BatchId,uint  packageId,string saleble_unit_createdby, uint saleble_unit_createddate)
    {
    SalebleUnit[SALEBLE_UNIT_ID]=Saleable_unit(SKU_code,BatchId,packageId,saleble_unit_createdby,saleble_unit_createddate);
    SKU_IdBatchMap[SKU_Id]=BatchId;
    SaleableUnitCreated(SALEBLE_UNIT_ID,SKU_code,BatchId);
    SALEBLE_UNIT_ID++;
    SKU_Id++;
    //.........................

    //.........................
    }

/* Method name : getSaleble

    Description : This method is used to get the Saleble details for the given saleble unit id

*/function getSaleable(uint SALEBLE_UNIT_ID)public constant returns(string SKU_code,string BatchId,uint packageId,string saleble_unit_createdby,uint saleble_unit_createddate)
    {
   return(
       SalebleUnit[SALEBLE_UNIT_ID].SKU_code,
       SalebleUnit[SALEBLE_UNIT_ID].BatchId,
       SalebleUnit[SALEBLE_UNIT_ID].packageId,
       SalebleUnit[SALEBLE_UNIT_ID].saleble_unit_createdby,
       SalebleUnit[SALEBLE_UNIT_ID].saleble_unit_createddate);
    }

  /* Method name : createPackage

    Description : This method is used to set the Package details for the given package id

*/function createPackage(string Quantity, string packaging_createdby, uint packaging_createddate)
    {
       Packagingdetails[PACKAGE_ID]=Packaging_detail(Quantity,packaging_createdby,packaging_createddate,saleableUnit);
       PackageCreated( PACKAGE_ID,Quantity);
       PACKAGE_ID++;
    } 

/* Method name : getPackagedetails

    Description : This method is used to get the Package details for the given package id

*/function getPackagedetails(uint PACKAGE_ID)public constant returns(string Quantity,string packaging_createdby,uint packaging_createddate,uint[] saleableUnits)
    {
     return(
       Packagingdetails[PACKAGE_ID].Quantity,
       Packagingdetails[PACKAGE_ID].packaging_createdby,
       Packagingdetails[PACKAGE_ID].packaging_createddate,
       Packagingdetails[PACKAGE_ID].saleableUnits);
    }

    function updatePackag_Id(uint _SalebleUnitId,uint _packageId)
    {
    require(_SalebleUnitId<SALEBLE_UNIT_ID && _packageId<PACKAGE_ID);
    SalebleUnit[_SalebleUnitId].packageId=_packageId;
    Packagingdetails[_packageId].saleableUnits.push(_SalebleUnitId);
    UpdatePackageId("package id updated to",_packageId);
    }

     

     /* Method name : getSKUCount

    Description : This method is used to get the SKU Count*/


     function getSaleableUnitCount() constant returns(uint SALEBLE_UNIT)
    {
        return SALEBLE_UNIT_ID; 
    }

         function getPACKAGECount() constant returns(uint PACKAGE)
    {
        return PACKAGE_ID; 
    }

    /*function for tracking batchid from SKU_Id

   

    function trackBatchFromSku(uint _SalebleUnitId)constant returns(string,string){

     

      return (SalebleUnit[_SalebleUnitId].SKU_code,SalebleUnit[_SalebleUnitId].BatchId);

        

    }*/

   

    }