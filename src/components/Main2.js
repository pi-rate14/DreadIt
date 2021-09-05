import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Button, Container } from "@material-ui/core";

import "./Navbar2.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 1000,
    height: 1000,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

const Main2 = (props) => {
  const classes = useStyles();
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.uploadImage(description);
  };

  return (
    <div>
      <Container maxWidth="sm" style={{ marginTop: "70px" }}>
        <Box>
          <Typography align="center" variant="h1" style={{ fontWeight: "600" }}>
            SHARE ;)
          </Typography>
        </Box>
        <div className="imageDetails">
          <TextField
            variant="outlined"
            placeholder="Enter Description..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            id="upload_file"
            accept=".jpg, .jpeg, .png, .bmp, .gif"
            hidden
            onChange={props.captureFile}
          />
          <div className="buttons">
            <Button variant="outlined" color="primary">
              <label htmlFor="upload_file">Choose</label>
            </Button>

            <Button
              variant="contained"
              color="primary"
              disabled={description ? 0 : 1}
              onClick={handleSubmit}
            >
              UPLOAD
            </Button>
          </div>
        </div>
        {props.images.map((image, key) => {
          return (
            <div
              style={{ width: "500px", margin: "auto" }}
              className="card mb-4"
              key={key}
            >
              <div className="card-header">
                <Typography color="textSecondary" variant="caption">
                  <b>By: </b>
                  {image.author}
                </Typography>
              </div>
              <ul id="imageList" className="list-group list-group-flush">
                <li className="list-group-item">
                  <p className="text-center">
                    <img
                      src={`https://ipfs.infura.io/ipfs/${image.hashVal}`}
                      style={{ maxWidth: "420px", maxHeight: "420px" }}
                    />
                  </p>
                  <p>{image.description}</p>
                </li>
                <li key={key} className="list-group-item py-2">
                  <small className="float-left mt-1">
                    TIPS:{" "}
                    {window.web3.utils.fromWei(
                      image.tipAmount.toString(),
                      "Ether"
                    )}{" "}
                    ETH
                  </small>
                  <button
                    className="btn btn-link btn-sm float-right pt-0"
                    style={{ float: "right" }}
                    name={image.id}
                    onClick={(event) => {
                      let tipAmount = window.web3.utils.toWei("0.1", "Ether");
                      console.log(event.target.name, tipAmount);
                      props.tipImageOwner(event.target.name, tipAmount);
                    }}
                  >
                    TIP 0.1 ETH
                  </button>
                </li>
              </ul>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default Main2;
