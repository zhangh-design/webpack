// 同步
/* import _ from "lodash";


console.info(_.join(['hello','world'],'-'))
 */

// 异步
function getComponent() {
  // return import("lodash").then()
  return import(/* webpackChunkName:"lodash" */ "lodash").then(({ default: _ }) => {
      console.log("success");
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    })
    .catch(error => {
      console.log("error");
    });
  /* return new Promise((resolve)=>{
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      resolve(element)
    }); */
}

/* getComponent().then(element => {
  document.body.appendChild(element);
}); */

document.addEventListener("click", ()=>{
  getComponent().then(element => {
    document.body.appendChild(element);
  });
});
