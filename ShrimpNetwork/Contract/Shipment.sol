pragma solidity ^0.4.18;

contract Shipment

    {

        //assigning 1st CONSIGNMENT_NO to 0

    uint CONSIGNMENT_NO=0;

    Shipment_detail ob;

   

    enum shippingState

        {

            SUBMITTED,RECEIVED_OK,SPOILED

        }

  

    struct Shipment_detail

        {

       string package_id;

       string weight;

       string description;

       string created_by;

       uint created_date;

       shippingState state;

        }

  

    mapping (uint => Shipment_detail) Shipment_map;

    event shipment_Created(uint CONSIGNMENT_NO,string package_id,shippingState state);
    event shipment_Updated(uint CONSIGNMENT_NO,string package_id,shippingState state);


    function createShipping( string _package_id,string _weight,string _description,string _created_by,uint _created_date) public

        {
        //creating shipment details

        ob.package_id =_package_id;

        ob.weight= _weight;

        ob.description=_description;

        ob.created_by=_created_by;

        ob.created_date=_created_date;

        ob.state=shippingState.SUBMITTED;

        Shipment_map[CONSIGNMENT_NO]=ob;

        //incrementing auto-generated index

        CONSIGNMENT_NO++;

        //raising event

        shipment_Created(CONSIGNMENT_NO,_package_id,ob.state);

        }

   

    function updateShippingStatus(uint consignment_no, string _package_id,shippingState state ) 

        {

            //changing shipment status

        Shipment_map[consignment_no].state=state;

        shipment_Updated(consignment_no,_package_id,state);

       

        }


 function getShippingdetails(uint CONSIGNMENT_NO ) view public returns (uint,string,string, string,string,uint,shippingState) {
       
        return (CONSIGNMENT_NO,Shipment_map[CONSIGNMENT_NO].package_id, Shipment_map[CONSIGNMENT_NO].weight,Shipment_map[CONSIGNMENT_NO].description,Shipment_map[CONSIGNMENT_NO].created_by,Shipment_map[CONSIGNMENT_NO].created_date,Shipment_map[CONSIGNMENT_NO].state);
        
    }
 function count() view public returns (uint) {
        return CONSIGNMENT_NO ;
    }

}
