import React from "react";

const LoginEduGain = () => {
  return (
    <React.Fragment>
      <img
        src={require("../images/edugain.png")}
        className="img-fluid"
        style={{
          height: 20,
          float: "right",
          marginLeft: 10
        }}
        alt="eduGAIN logo"
      />
      <span style={{ width: 95 }}>Log in via</span>
    </React.Fragment>
  );
};

export default LoginEduGain;
