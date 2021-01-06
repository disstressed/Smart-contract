pragma solidity ^0.5.0;

contract Market{
    string public name;
    uint public productCount = 0 ;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }


    constructor() public{
        name = "Riep";
    }


    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

        event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct (string memory _name, uint _price) public {
        require(bytes(_name).length>0);
        require(_price>0);
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        //fetch product
        Product memory _product = products[_id];
        //fetch owner
        address payable _seller = _product.owner;
        //check valid
        require(_product.id>0 && _product.id <= productCount);
        require(msg.value>=_product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        //purchase /transfer
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update
        products[_id] = _product;
        //pay
        address(_seller).transfer(msg.value);
        //trigger
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }

}