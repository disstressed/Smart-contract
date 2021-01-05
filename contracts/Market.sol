pragma solidity ^0.5.0;

contract Market{
    string public name;
    
    constructor() public{
        name = "Riep";
    }

struct Product {
    uint id;
    string name;
    uint price;
    address owner;
    bool purchased;
}

}