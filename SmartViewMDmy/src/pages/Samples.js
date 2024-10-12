import React from "react";
import SideMenu from "../SideMenu";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useParams } from "react-router-dom";

// import "./Report.css"; // For Reporting

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

function Samples(props) {
  //const [reports, setReports] = useState([]);

  const params = useParams();

  const stackedBarExample = {
    labels: ["No DOB","18 - 29","30 - 49","50 - 64","65+"],
    datasets: [{
      label: 'Male',
      backgroundColor: "#caf270",
      data: [12, 59, 5, 56, 58,12, 59, 87, 45],
    }, {
      label: 'Female',
      backgroundColor: "#45c490",
      data: [12, 59, 5, 56, 58,12, 59, 85, 23],
    }, {
      label: 'Not Specified',
      backgroundColor: "#008d93",
      data: [12, 59, 5, 56, 58,12, 59, 65, 51],
    }]
  }
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774",
      },
    ],
  };

  const state = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  const pie = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#B21F00",
          "#C9DE00",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
        ],
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  return (
    <div>
      <SideMenu id={params.id} sample />
      <h2>Sample Charts</h2>
      <hr/>
        <Bar
          data={stackedBarExample}
          options={{
            title: {
              display: true,
              text: "Stacked Bar example -- Group data. Total Enrolled by Age & Gender",
              fontSize: 12,
            },
            legend: {
              display: true,
              position: "top",
            },
            tooltips: {
              displayColors: true,
              callbacks:{
                mode: 'x',
              },
            },
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: {
                  display: false,
                }
              }],
              yAxes: [{
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
                type: 'linear',
              }]
            },
            responsive: true,
            maintainAspectRatio: true
          }}
        />
      <hr/>
        <Line
          data={data}
          options={{
            title: {
              display: true,
              text: "Line Chart (random data)",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "top",
            },
          }}
        />
      <hr/>
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: "Average Rainfall per month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      <hr/>
      <Pie
        data={pie}
        options={{
          title: {
            display: true,
            text: "Average Rainfall per month",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
<hr/>
      <Doughnut
        data={pie}
        options={{
          title: {
            display: true,
            text: "Average Rainfall per month",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
<hr/>
  More charts available ...
    </div>
  );
}

export default Samples;
