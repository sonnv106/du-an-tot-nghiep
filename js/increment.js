function increaseValue() {
  var value = parseInt(document.getElementById('amount').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('amount').value = value;
}

function decreaseValue() {
  var value = parseInt(document.getElementById('amount').value, 10);
  value = isNaN(value) ? 0 : value;
  value < 1 ? value = 1 : '';
  value--;
  document.getElementById('amount').value = value;
}