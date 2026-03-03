import {
  html,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";

//EVENTUALLY INTEGRATE PIE CHART
//import Chart from "chart.js/auto";
import pieChart from "./pieChartChild.js";
import { getMusic } from "../../Services/getMusic/getMusic.js";

export default function pieChartParent() {
  const [chart, setChart] = useState([]);
  const [newParameter, setParameter] = useState("genre");

  useEffect(() => {
    getMusic().then((data) => {
      setChart(data.songs);
    });
  }, []);

  function updateParameter(newParameter) {
    setParameter(newParameter);
  }

  let pieElements = chart.map((e) => e[newParameter]);

  const counts = pieElements.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  //DATA FOR PIE CHART
  //   const pieChartData = {
  //     labels: Object.keys(counts),
  //     datasets: [
  //       {
  //         label: newParameter,
  //         data: Object.values(counts),
  //       },
  //     ],
  //   };

  let pieChartData = Object.entries(counts).map(
    ([key, value]) => html`<li>${key}: ${value}</li>`
  );

  return html`
    <div class="pieChartParent">
      <${pieChart} getParameter=${updateParameter} pieData=${pieChartData} />
    </div>
  `;
}
