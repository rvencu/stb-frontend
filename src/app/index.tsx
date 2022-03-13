import React, {useState, useEffect} from 'react';
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components/macro';
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function dateStr(date:Date){
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var dt = date.getDate();

  var day = dt.toString();
  if (dt < 10) {
    day = '0' + dt;
  }
  var mnt = month.toString();
  if (month < 10) {
    mnt = '0' + month;
  }

  return year + '-' + mnt + '-' + day;
}

function addDays(date: Date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function App() {

  const MyContainer = ({ className, children }) => {
    return (
      <div style={{ padding: "16px", background: "rgba(0, 12, 88, 88)", color: "#fff" }}>
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right' as const,
      },
      title: {
        display: false,
        text: 'Available nodes',
      },
    },
    layout: {
        padding: {
            bottom: 50
        }
    },
    onClick: function(evt, element) {
      if(element.length > 0) {
          setEndDate(addDays(startDate,element[0].index+30))
          setStartDate(addDays(startDate,element[0].index)) 
      }}
  };
  const Left = styled.div`
  display:inline-block;
  width:25%;
  float:left;
`;
const Right = styled.div`
  display:inline-block;
  width:25%;
  float:left;
`;
 const [startDate, setStartDate] = useState(new Date());
 const [endDate, setEndDate] = useState(addDays(startDate,30));
 const [resultArray, setResultArray] = useState([]);

 useEffect(() => {
    const expensesListResp = async () => {
      await axios.get('https://micro.laion.ai/free/?fromdate='+ dateStr(startDate) + '&todate=' + dateStr(endDate))
      .then(
        response => setResultArray(response.data))
    }
    expensesListResp();
  }, [startDate, endDate]);

  var labels = resultArray.map(({ daygrid }) => daygrid);
  console.log(labels)

  var data = {
    labels,
    datasets: [
      {
        label: 'Available nodes',
        data: resultArray.map(({ reserved }) => reserved),
        backgroundColor: 'rgba(0, 12, 88, 88)',
      },
    ],
  }
  return  <><Left>From: <DatePicker
    dateFormat="yyyy-MM-dd"
    selected={startDate}
    onChange={(date) => setStartDate(date)}
    calendarContainer={MyContainer} /></Left><Right>To: <DatePicker
    dateFormat="yyyy-MM-dd"
    selected={endDate}
    onChange={(date) => setEndDate(date)}
    calendarContainer={MyContainer} /></Right><Bar options={options} data={data} /></>;
}



