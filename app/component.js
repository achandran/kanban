module.exports = function sayHello() {
  const element = document.createElement('h1');
  element.innerHTML = 'hello world!';
  return element;
};
