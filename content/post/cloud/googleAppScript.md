---
categories:
- uncategorized
date: "2022-09-14T09:58:24+08:00"
slug: google-app-script-calender-api
tags:
- js
- google
- cloud
title: Google AppScript Calender API
---

# Google AppScript

因為我懶的一堂一堂課加入日曆、還要按重複，所以就來研究如何自動化。我的想法是透過一個物件定義課表，然後透過程式來自動化新增。評估了幾個技術後，決定使用 Google App Script 來實做，畢竟他和日曆都是 Google 產品，整合應該是最好的（吧，而且可以弄成類似雲端應用的感覺，輕鬆開放給其他人使用。

## 建立專案

在 https://script.google.com/home 建立新專案後，會自動建立 `程式碼.gs`，雖然他寫 `.gs`，但可以直接當作 javascript 看，看設定頁面，背後應該也是 V8 在執行。

## 連結 Google Calendar

我們的程式要連結日曆，需要權限和 API，點擊左側「服務」右邊的「+」，找到 `Google Calendar API`，按新增

## 新增一個活動

先透過一些範例來看看怎麼和 Google Calendar 互動

### 單次的活動

```javascript
function myFunction() {
	const calendar = CalendarApp.getCalendarsByName('test');
	if (calendar) calendar.createEvent('吃火鍋', new Date(2022, 08, 14, 18, 00), new Date(2022, 08, 14, 19, 00));
}
```

> https://developers.google.com/apps-script/reference/calendar/calendar#createeventtitle,-starttime,-endtime

寫好函數後，把上方的測試函數改成 `myFunction`，然後按「執行」，就會單次執行這個函數了

### 重覆的活動

接下來，來試試重複的活動，基本上只是新增一個 `RecurrenceRule` 物件

```javascript
function myFunction() {
	const calendar = CalendarApp.getCalendarsByName('test');
	if (calendar)
		calendar.createEventSeries(
			'吃火鍋',
			new Date(2022, 08, 14, 18, 00),
			new Date(2022, 08, 14, 19, 00),
			CalendarApp.newRecurrence().addWeeklyRule().until(semester.end)
		);
}
```

> https://developers.google.com/apps-script/reference/calendar/calendar#createeventseriestitle,-starttime,-endtime,-recurrence  
> https://developers.google.com/apps-script/reference/calendar/event-recurrence

## http

現在我們能和日曆溝通了，理論上在加上一個好用的 API 界面就可以結束了，但是我還想加上一個 web 界面，這樣就可以不用每次都來編輯程式碼。

1. 新增 `doGet(e)` 函數

```javascript
function doGet(e) {
	return HtmlService.createHtmlOutputFromFile('index.html');
}
```

2. 部署成網頁應用程式
    1. 點右上角藍色的「部署」>「新增部署作業」
    2. 點選左上角的齒輪>網頁應用程式
    3. 設定
    4. 按下「部署」
    5. 獲得正式連結
3. 測試部署作業
    1. 點右上角藍色的「部署」>「測試部署作業」
    2. 獲得測試連結

> **Notice**  
> 建立測試部署作業之前需要先正式部署  
> 正式部署用得程式是建立當下的版本，測試部署是會一直用最新版本

我們可以在 `doGet(e)` 函數中用 `e.parameter` 取得 querystring 得內容

> https://developers.google.com/apps-script/guides/web

然後就可以用這些東西湊一湊弄出一個好用的課表 WebApp 了

## 驗證應用程式

現在登入我們的網頁都會跳說這個應用程式不安全，需要提交程式給 Google 驗證後才能移除，不然就會一直出現這個醜醜的畫面，但是我還沒研究出來怎麼弄，也懶得弄。https://medium.com/@joshchang_51558/%E5%A6%82%E4%BD%95%E5%BF%AB%E9%80%9F%E6%9C%89%E6%95%88%E7%9A%84%E9%80%9A%E9%81%8E-google-oauth-scope-verification-35019d93ce95 這個看起來應該可以參考

## 我的程式碼

### main.gs

```javascript
function doGet(e) {
	if (!e.parameter.data) return HtmlService.createHtmlOutputFromFile('index.html');
	return ContentService.createTextOutput(JSON.stringify(e));
}

function setCalendar(data) {
	console.log('setCalendar', data);
	let semester = {
		start: new Date(...data.semester.start),
		end: new Date(...data.semester.end),
	};
	console.log(semester);
	let calendar = CalendarApp.getCalendarsByName(data.calendar)[0];
	let recurrence = CalendarApp.newRecurrence().addWeeklyRule().until(semester.end);
	if (!calendar) {
		return new Error(`calendar ${data.calendar} not found`);
	}
	data.lessions.forEach(item => addLession(calendar, semester, ...item, recurrence));
	return undefined;
}

function getTime(day, start, end) {
	day.setMinutes(0);
	day.setSeconds(0);
	let table = {
		1: 8,
		2: 9,
		3: 10,
		4: 11,
		5: 13,
		6: 14,
		7: 15,
		8: 16,
		9: 17,
	};
	let startDate = new Date(day);
	startDate.setHours(table[start]);
	startDate.setMinutes(10);
	let endDate = new Date(day);
	endDate.setHours(table[end] + 1);

	return [startDate, endDate];
}

// setWod set day of week for a Date object
function setDow(day, dow) {
	let d = new Date(day);
	d.setDate(parseInt(day.getDate()) - parseInt(day.getDay()) + parseInt(dow));
	return d;
}

function addLession(calendar, semester, name, dow, start, end, recurrence) {
	console.log(name, dow, start, end);
	let [startDate, endDate] = getTime(setDow(semester.start, dow), start, end);
	console.log({ startDate, endDate });
	console.log(calendar.createEventSeries(name, startDate, endDate, recurrence));
}
```

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
  </head>
  <body>
    <form id="form">
      <fieldset>
        <legend>學期：</legend>
        <input type="radio" id="semester" value="1111" checked>111-1</input>
      </fieldset>
      <fieldset>
        <legend>日曆：</legend>
        <input type="text" id="calendar"></input>
      </fieldset>
      <fieldset>
        <legend>課表：</legend>
        <table>
          <thead>
              <tr>
                <th>科目</th>
                <th>星期幾</th>
                <th>開始節次</th>
                <th>結束節次</th>
              </tr>
          </thead>
          <tbody id="lessions">
            <tr>
              <td>
                <input placeholder="科目" type="text" required></input>
              </td>
              <td>
                <input placeholder="星期幾" type="number" min="1" max="7" required></input>
              </td>
              <td>
                <input placeholder="開始節次" type="number" min="1" max="9" required></input>
              </td>
              <td>
                <input placeholder="結束節次" type="number" min="1" max="9" required></input>
              </td>
              <td>
                <button type="button" class="delete">X</button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                <button id="add" type="button" style="width:100%">增加</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </fieldset>
      <button type="submit">送出</button>
    </form>

    <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
    <script>
      function getDateBySememster(n){
        let data = {
          1111: {
            start: [2022, 9-1, 5],
            end: [2023, 1-1, 6+1],
          }
        };
        return data[n];
      }

      function msg(data){
        if(data){
          alert(JSON.stringify(data))
        }else{
          alert('成功！')
        }
        $('#form input,button').attr('disabled', false)
      }

      $(document).ready(() => {
        $('#add').click(() => {
          let $lessions = $('#lessions')
          let id = $lessions.children().length
          let row = $lessions.children().eq(0).clone()
          $('td:nth-child(1)', row).text(id)
          for(let i = 1; i <= 4; i++){
            let td = $(`td:nth-child(${i}) input`, row)
            td.val('')
          }
          $lessions.append(row)
          $('button', row).click(setDelete)
        })
        $('#form').submit(e => {
          e.preventDefault();
          let data = {
            semester: getDateBySememster($('#semester').val()),
            calendar: $('#calendar').val(),
            lessions: [...$('#lessions tr')].map(item => [1, 2, 3, 4].map(i => $(`td:nth-child(${i}) input`, item).val()))
          }
          console.log(data)
          $('#form input,button').attr('disabled', true)
          google.script.run
            .withFailureHandler(msg)
            .withSuccessHandler(msg)
            .setCalendar(data)
        })
        let setDelete = function(){
          if($('#lessions tr').length <= 1) return
          $(this).parent().parent().remove()
        }
        $('.delete').click(setDelete)
      })
    </script>
  </body>
</html>
```
