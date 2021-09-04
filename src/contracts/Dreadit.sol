pragma solidity ^0.5.16;

contract Dreadit {
  string public name = "DreadIt";
  
  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hashVal;
    string desctiption;
    uint tipAmount;
    address payable author;
  }

  function uploadImage() public {
    images[1] = Image(1, 'abc123', "Hello, World", 0, address(0x0));
  }
}