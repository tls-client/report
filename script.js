const status = document.getElementById("status");
const reportIds = document.getElementById("reportID");
const errorlog = document.getElementById("errorLog");
let isProcessing = false;
async function start() {
  if (isProcessing) return (status.value = "Error: Already processing");
  isProcessing = true;
  const tokens = document.getElementById("token").value.trim();
  const channelId = document.getElementById("channelId").value;
  const messageId = document.getElementById("messageId").value;
  if (!tokens || !channelId || !messageId) {
    status.value = "Error: Please fill all required fields";
    return (isProcessing = false);
  }
  let select;
  for (let i = 0; i <= 4; i++) {
    const type = document.getElementById("type" + i);
    if (type.checked) {
      console.log(i);
      select = i;
      break;
    } else if (i == 4 && !type.checked) {
      status.value = "Error: Please select at least one type";
      return (isProcessing = false);
    }
  }
  const tokenArray = tokens.split("\n");
  const request = {
    headers: {
      "content-type": "application/json",
    },
    body: {
      version: "1.0",
      variant: "6",
      language: "en",
      elements: {},
      channel_id: channelId,
      message_id: messageId,
      name: "message",
    },
    method: "POST",
  };
  if (select == 0) {
    request.body.breadcrumbs = [3, 79];
  } else if (select == 1) {
    request.body.breadcrumbs = [3, 57, 82];
  } else if (select == 2) {
    request.body.breadcrumbs = [3, 57, 83];
  } else if (select == 3) {
    request.body.breadcrumbs = [3, 75, 76, 82];
  } else if (select == 4) {
    request.body.breadcrumbs = [3, 60, 7];
    request.body.elements.pii_select = [];
    for (let i = 1; i <= 8; i++) {
      const element = document.getElementById("type4-" + i);
      if (element.checked) {
        switch (i) {
          case 1:
            request.body.elements.pii_select.push("physical_address");
            continue;
          case 2:
            request.body.elements.pii_select.push("phone_info");
            continue;
          case 3:
            request.body.elements.pii_select.push("credit_info");
            continue;
          case 4:
            request.body.elements.pii_select.push("email_address");
            continue;
          case 5:
            request.body.elements.pii_select.push("legal_name");
            continue;
          case 6:
            request.body.elements.pii_select.push("ip_address");
            continue;
          case 7:
            request.body.elements.pii_select.push("face_pic");
            continue;
          case 8:
            request.body.elements.pii_select.push("revenge_porn");
            continue;
        }
      }
    }
  } else {
    return status.value == "Error: unknown";
  }
  try {
    if (request.body.elements.pii_select.length == 0) {
      status.value = "Error: Please select at least one type";
      return (isProcessing = false);
    }
  } catch (e) {}
  const url = "https://discord.com/api/v9/reporting/message";
  request.body = JSON.stringify(request.body);
  for (const token of tokenArray) {
    let data;
    request.headers.authorization = token;
    try {
      data = await fetch(url, request);
    } catch (e) {
      status.value = "error:" + e.message + " token=" + token;
      const error = document.createElement("li");
      error.textContent = e.message;
      errorlog.appendChild(error);
      continue;
    }
    if (data.ok) {
      const reportId = await data.json();
      status.value = "success:" + reportId.report_id;
      const li = document.createElement("li");
      li.textContent = "reportID:" + reportId.report_id + " token=" + token;
      reportIds.appendChild(li);
    } else {
      const e = await data.json();
      status.value = "error:" + e.message + " token=" + token;
      const error = document.createElement("li");
      error.textContent = e.message + " token=" + token;
      errorlog.appendChild(error);
      continue;
    }
  }
  console.log(request);
  isProcessing = false;
}
function saveContent() {
  const texts = document.querySelectorAll("input, textarea");
  texts.forEach((text) => {
    localStorage.setItem(text.id, text.value);
  });
}
function loadContent() {
  const texts = document.querySelectorAll("input, textarea");
  texts.forEach((text) => {
    if (localStorage.getItem(text.id)) {
      text.value = localStorage.getItem(text.id);
    }
    status.value = "Status:ready";
  });
}
window.addEventListener("beforeunload", saveContent);
window.addEventListener("load", loadContent);
function reset() {
  location.reload();
}
/*
こんにちは、コードを見てくれてありがとうございます。
解析等は自由にしていいので一つお願いがあります
貴方のような技術者を私は探しています
もし貴方がこのコードを見ているならば私のサーバーにご参加ください
プログラミング技術の向上や情報交換を目的としています
荒らし関係者の方でも構いません

# 🌐 |- how to program🤔
https://discord.gg/tfyqW3CNZh

参加をお待ちしております！
*/
