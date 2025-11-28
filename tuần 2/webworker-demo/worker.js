// worker.js
let timer;

onmessage = function(e) {
  const {num1, num2} = e.data;
  const a = Number(num1);
  const b = Number(num2);

  // hàm gửi kết quả
  function sendResult(x, y) {
    const result = x + y;
    postMessage(result);
  }

  // gửi kết quả lần đầu
  sendResult(a, b);

  // cứ sau 5 giây gửi lại (tiếp tục cộng dồn ví dụ cho dễ thấy)
  let current = a + b;
  clearInterval(timer);
  timer = setInterval(() => {
    current = current + b; // cộng dồn với num2
    postMessage(current);
  }, 5000);
};
