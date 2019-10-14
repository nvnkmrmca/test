"use strict";

exports.get = (req, res) => {
  res.status(200).send({
    message: "API is alive."
  });
};