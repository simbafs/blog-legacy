import { readFileSync } from 'fs'

const avatar = readFileSync('./assets/img/avatar.png')

/** @param {import("@simbafs/og/dist/type").data} data */
export const template = data => `<div
  style="height: 100%; 
  width: 100%; 
  display: flex"
>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.02em;
      font-weight: 700;
      flex-direction: column;
      gap: 10px;
      background-color: white;

      border-radius: 40px;
      background: radial-gradient(
          circle at 25px 25px,
          lightgray 2%,
          transparent 0%
        ),
        radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%);
      background-size: 100px 100px;
    "
  >
    <!-- icon -->
    <div
      style="
        display: flex;
        left: 30px;
        top: 30px;
        position: absolute;
        align-items: center;
      "
    >
    <img
    src="data:image/png;base64,${avatar.toString('base64')}"
    style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: solid black 1px;
        /* background: #303030; */
        background-size: 40px 40px;
        box-shadow: 3px 5px 10px 0px rgba(100, 100, 100, 0.61);
    "/>
      <span style="margin-left: 8px; font-size: 20px; color: #303030"
        >https://blog.simbafs.cc</span
      >
    </div>

    <!-- title  -->
    <div
      style="
        display: flex;
        background-color: #303030;
        box-shadow: 3px 5px 10px 0px rgba(100, 100, 100, 0.61);
        color: white;
        border-radius: 10px;

        font-size: 40px;

        padding: 15px 50px;
        margin: 0px 40px;

        text-align: center;
      "
    >
      ${data.title}
    </div>

    <!-- description -->
    <div
      style="
        display: flex;
        background-color: #424242;
        box-shadow: 3px 5px 10px 0px rgba(100, 100, 100, 0.61);
        color: white;
        border-radius: 10px;

        font-size: 20px;

        padding: 15px 50px;
        margin: 0px 40px;

        text-align: center;
      "
    >
      ${data.description}
    </div>

    <!-- tags -->
    <div
      style="
        display: flex;
        position: absolute;
        bottom: 20px;
        right: 30px;
        font-size: 20px;
      "
    >
      ${data.tags.join(', ')}
    </div>
  </div>
</div>
`
