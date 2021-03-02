//jshint esversion:6

module.exports.getdate =  getdate;

function  getdate(){
  let day = new Date();
let options = {
  weekday: "long",
  day:"numeric",
  month:"long"
};
return day.toLocaleDateString("en-US",options);
};

module.exports.getday =  getday;


function  getday(){
  let day = new Date();
let options = {
  weekday: "long",
};
return day.toLocaleDateString("en-US",options);
};
