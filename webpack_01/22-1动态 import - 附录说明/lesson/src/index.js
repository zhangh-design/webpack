// import _ from "lodash";
// import "core-js/modules/es.promise";
// import "core-js/modules/es.array.iterator";

function getComponent() {
    // return "111";
    // return import("lodash")
  return import(/* webpackChunkName:"lodash" */ "lodash").then(() => {
    console.log("success");
    var element = document.createElement("div");
    element.innerHTML = _.join(["hello", "world"], "-");
    return element;
  });
    /* return new Promise((resolve)=>{
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      resolve(element)
    }); */
}
// getComponent()
getComponent().then(element => {
    document.body.appendChild(element)
//   console.log(element);
});

/*   document.addEventListener("click", ()=>{
    getComponent().then(element => {
      document.body.appendChild(element);
    });
  }); */
