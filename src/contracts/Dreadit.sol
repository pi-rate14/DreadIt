pragma solidity ^0.5.16;

contract Dreadit {
  string public name = "DreadIt";
  
  mapping(uint => Image) public images;
  uint public imageCount = 0;

  struct Image{
    uint id;
    string hashVal;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hashVal,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hashVal,
    string description,
    uint tipAmount,
    address payable author
  );

  function uploadImage(string memory _imgHash, string memory _description) public {
    
    require(bytes(_description).length > 0, "Description cannot be empty");

    require(bytes(_imgHash).length > 0, "image cannot be empty");

    require(msg.sender != address(0x0), "Adress cannot be blank");

    imageCount ++;
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }

  
  function tipImageOwner(uint _id) public payable {

    require(_id > 0 && _id <= imageCount);
    
    Image memory _image = images[_id];
    address payable _author = _image.author;
    address(_author).transfer(msg.value);
    _image.tipAmount = _image.tipAmount + msg.value;
    images[_id] = _image;
    emit ImageTipped(_id, _image.hashVal, _image.description, _image.tipAmount, _author);
  }
}