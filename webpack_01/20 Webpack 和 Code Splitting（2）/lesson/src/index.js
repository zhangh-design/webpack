/* import _ from 'lodash'; 

console.info(_.join(['a', 'd', 'c'],'***'));
console.info(_.join(['a', 'c', 'c'],'***'));
 */

function getComponent() {
  return import("lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
