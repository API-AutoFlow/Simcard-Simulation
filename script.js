const url = "https://autoflow.navidelyasi.com/";
// const url = "http://127.0.0.1:2022/";
const xhr = new XMLHttpRequest();

const myBarAggregatedChart1 = new Chart(document.getElementById("myBarAggregatedChart1").getContext('2d'), {
    type: 'bar',
    data: {
        labels: "",
        datasets: [{
                label: "",
                data: "",
                backgroundColor: "",
                borderColor: "",
            }]
    },
    options: {
      scales: {
          x: {
            title: {
              display: true,
              text: 'Customer Number'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Data Usage (MB)'
            }
          }
      }
    }
});

const myBarAggregatedChart2 = new Chart(document.getElementById("myBarAggregatedChart2").getContext('2d'), {
    type: 'bar',
    data: {
        labels: "",
        datasets: [{
                label: "",
                data: "",
                backgroundColor: "",
                borderColor: "",
            }]
    },
    options: {
      scales: {
          x: {
            title: {
              display: true,
              text: 'Customer Number'
            }
          },
          y: {
            title: {
              display: true,
              text: 'SMS Usage'
            }
          }
      }
    }
});

const multiLineChart1 = new Chart(document.getElementById("multiLineChart1").getContext('2d'), {
    type: 'line',
    data: {
        labels: "",
        datasets: ""
    },
    options: {
      scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Data Usage (MB)'
            }
          }
      }
    }
});

const multiLineChart2 = new Chart(document.getElementById("multiLineChart2").getContext('2d'), {
    type: 'line',
    data: {
        labels: "",
        datasets: ""
    },
    options: {
      scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'SMS Usage'
            }
          }
      }
    }
});

const pieChartActivation = new Chart(document.getElementById("pie_chart_activation").getContext('2d'), {
  type: 'pie',
  data: {
      labels: "",
      datasets: [{
        label: "",
        data: "",
        backgroundColor: "",
        borderColor: "",
        hoverOffset: 4
    }]
  }
});

  /****                              Header Tabs Toggle                              */
  function rudrSwitchTab(rudr_tab_id, rudr_tab_content) {
    var x = document.getElementsByClassName("tabcontent");
    console.log(x);
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    document.getElementById(rudr_tab_content).style.display = 'block';
    var x = document.getElementsByClassName("nav-item nav-link");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].className = "nav-item nav-link";
    }
    document.getElementById(rudr_tab_id).className = 'nav-item nav-link active';

  }

  /*************************************************************************************************/

  /********************************  Activate SIM                                */
function activateThis(){
  var customerNo = document.getElementById("customer_no_to_activation").value;
  var activeOrPend = document.getElementById("activate_or_pending").value.toLowerCase();
  if(customerNo.length != 3){
    alert("Customer Number should be 3 digits");
  } else if (activeOrPend == "pending" || activeOrPend == "activate"){
    var msg = '{"customer_no":"'+ customerNo +'","status":"'+ activeOrPend +'"}';
    console.log("we are here 222");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        
        document.getElementById("customer_no_activation").value = customerNo;
        getActivationHistory();
      }
    };
    xhr.open("POST", url+"insert-sim-status", true);
    xhr.send(msg);
  } else {
    alert("Status should be Activate or Pending");
  }

}

  /********************************  Activation History                                 */
function getActivationHistory(){
    document.getElementById("activation_list").innerHTML = "";
    var customerNoActivation = document.getElementById("customer_no_activation").value;
    if(customerNoActivation.length != 3){
      alert("customer number should be 3 digits");
    } else {
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // console.log(JSON.parse(this.responseText));
          createActivationList(JSON.parse(this.responseText).specific_customer);
          drawPieChart_step1(JSON.parse(this.responseText).last_status_all);
        }
      };
      xhr.open("POST", url+"get-sim-activation", true);
      xhr.send("{\"customer_no\":\"" + customerNoActivation + "\"}");

    }
}

function createActivationList(myList){
    var i;
    // console.log(myList);
    for(i=0;i<myList.length;i++){
      let a = document.createElement('div');
      a.className = "card m-1"
      let b1 = document.createElement('div');
      b1.className = "card-body"
      b1.textContent = "date :" + myList[i].date + 
                      '\xa0\xa0\xa0 Request_id :' + myList[i].request_id + 
                      '\xa0\xa0\xa0 Status :' + myList[i].status;
      a.appendChild(b1);
      document.getElementById("activation_list").appendChild(a);
    }
  }

  function drawPieChart_step1(myList){
    var num_activate = 0;
    var i;
    for(i = 0; i < myList.length ; i++){
      if (myList[i].status == "activate"){
        num_activate++;
      }
    }
    var num_pending = myList.length - num_activate;
    console.log(num_activate);
    console.log(num_pending);

    pieChartActivation.data.labels = ['Activate','Pending'];
    pieChartActivation.data.datasets[0].label = "Activation Status of All";
    pieChartActivation.data.datasets[0].data = [num_activate, num_pending];
    pieChartActivation.data.datasets[0].backgroundColor = ['rgb(54, 162, 235)','rgb(255, 99, 132)'];
    pieChartActivation.data.datasets[0].borderColor = ['rgb(54, 162, 235)','rgb(255, 99, 132)'];
    pieChartActivation.reset();
    pieChartActivation.update();
  }

  /********************************  Insert New SIM                                   */
  function insertSim(){
    var imei = document.getElementById("insert-sim-imei").value;
    var pin1 = document.getElementById("insert-sim-pin1").value;
    var customer_no = document.getElementById("insert-sim-customer-no").value;
    var specification = document.getElementById("insert-sim-specification").value;
    var email = document.getElementById("insert-sim-email").value;
    if (email.split("@").length==1||email.slice(email.length-4,email.length)!=".com"){
      alert("Email is not correct");
    } else if (imei.length>0&&pin1.length>0&&customer_no.length>0&&specification.length>0&&email.length>0){
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          getSims();
        }
      };
      xhr.open("POST", url+"insert-sim", true);
      xhr.send('{"imei":"'+imei+'","pin1":"'+pin1+'","customer_no":"'
          +customer_no+'","sim_specification":"'+specification+'","email":"'+email+'"}');
    } else {
      alert("you need to provide required info\n1- IMEI\n2- Pin 1\n3- Customer Number\n4- Specification\n5- Your Email");
    }
  }

  /********************************  All SIM Info                                    */
  function getSims() {
    document.getElementById("all_sims_list").innerHTML = '';
    console.log(url+"get-sims");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          createSimList(JSON.parse(this.responseText));
          console.log(JSON.parse(this.responseText));
      }
    };
    xhr.open("GET", url+"get-sims", true);
    xhr.send();
  }
  function createSimList(myList){
    var i;
    for(i=0;i<myList.length;i++){
      let a = document.createElement('div');
      a.className = "card m-1"
      let b1 = document.createElement('div');
      b1.className = "card-body"
      b1.textContent = "customer number :" + myList[i].customer_no + 
                      '\xa0\xa0\xa0 IMEI :' + myList[i].imei + 
                      '\xa0\xa0\xa0 pin1 :' + myList[i].pin1 + 
                      '\xa0\xa0\xa0 sim_specification :' + myList[i].sim_specification;
      a.appendChild(b1);
      document.getElementById("all_sims_list").appendChild(a);
    }
  }

  /********************************   SIM Log                                        */
  function getAggregatedSimLog() {
    var needTop = document.getElementById("need_top").value.toLowerCase();
    var needCount = document.getElementById("need_count").value;
    if (needCount.length==0 || needTop.length==0){
      alert("please provide information: \n1- top or last\n2- how many");
    }else if (needTop=="top" || needTop=="last"){
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          getAggregatedSimLog_Step2(JSON.parse(this.responseText), needTop);
        }
      };
      xhr.open("POST", url+"aggregated-log", true);
      xhr.send("{\"top\":\"" + needTop + "\",\"count\":\"" + needCount + "\"}");

    }else{
      alert("you need to mention top or last");
    }
  }
  function getAggregatedSimLog_Step2(logOfData, needTop){

    let customer_list = [];
    let data_list = [];
    let sms_list =[];
    let all_datas_list = [[],[]];
    let all_colors;
    if (needTop == "top"){
        all_colors = ['rgb(158, 0, 33)','rgb(11, 0, 158)'];
    }else{
        all_colors = ['rgb(158, 137, 0)','rgb(0, 158, 87)'];
    }
    let all_titles = ["Data Usage (MB)","SMS Usage"];
    var i;

    for(i=0;i<logOfData.length;i++){
        customer_list.push(logOfData[i].customer_no);
        data_list.push(logOfData[i].aggregated_data);
        sms_list.push(logOfData[i].aggregated_sms);
    }

    all_datas_list[0].push(data_list);
    all_datas_list[1].push(sms_list);
    
    drawBarChart(customer_list, all_datas_list[0][0], all_colors[0], all_titles[0],myBarAggregatedChart1);
    drawBarChart(customer_list, all_datas_list[1][0], all_colors[1], all_titles[1],myBarAggregatedChart2);
  }
function drawBarChart(customer_list, datas, color, title, chart_id) {
    // console.log(title);
    chart_id.data.labels = customer_list;
    chart_id.data.datasets[0].label = title;
    chart_id.data.datasets[0].data = datas;
    chart_id.data.datasets[0].backgroundColor = makeColorTransparent(color);
    chart_id.data.datasets[0].borderColor = color;
    chart_id.update();
}


  /********************************   Insert New Log                                        */
function insertNewLog1(){
  var customerNo = document.getElementById("insert_log_customer_no1").value;
  var data = document.getElementById("insert_log_data1").value;
  var sms = document.getElementById("insert_log_sms1").value;
  var date = document.getElementById("insert_log_date1").value;
  if(customerNo.length==0||data.length==0||sms.length==0||date.length==0){
    alert("you need to provide required data");
  } else{
    // console.log('{"customer_no":"'+customerNo+'","sms":"'+sms+'","data":"'+data+'","date":"'+date+'"}');
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("need_top").value = "top";
        document.getElementById("need_count").value = "10";
        getAggregatedSimLog();
      }
    };
    xhr.open("POST", url+"insert-sim-log", true);
    xhr.send('{"customer_no":"'+customerNo+'","sms":"'+sms+'","data":"'+data+'","date":"'+date+'"}')

  }
}

function insertNewLog2(){
  var customerNo = document.getElementById("insert_log_customer_no2").value;
  var data = document.getElementById("insert_log_data2").value;
  var sms = document.getElementById("insert_log_sms2").value;
  var date = document.getElementById("insert_log_date2").value;
  if (customerNo.length==0||data.length==0||sms.length==0||date.length==0){
    alert("you need to provide required data");
  } else {
    // console.log('{"customer_no":"'+customerNo+'","sms":"'+sms+'","data":"'+data+'","date":"'+date+'"}');
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("customer_no2").value = customerNo;
        get3SimLog_step1();
      }
    };
    xhr.open("POST", url+"insert-sim-log", true);
    xhr.send('{"customer_no":"'+customerNo+'","sms":"'+sms+'","data":"'+data+'","date":"'+date+'"}');
  }
}

  /********************************   Multi SIM Log                                        */
  function get3SimLog_step1(){
    var i;
    var logMultiSim = [];
    for(i=0;i<3;i++){
      var customerNo = document.getElementById("customer_no".concat(i.toString())).value;
      if (customerNo.length > 2){
        logMultiSim.push(customerNo);
      }
    }
    i = 0;
    if(logMultiSim.length==0){
      alert("you have to mention at least one customer number");
    } else {
      getMultiSimLog(i, logMultiSim);
    }
  }
  function getMultiSimLog(counter, logMultiSim) {
    var customerNo = logMultiSim[counter];
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        logMultiSim[counter] = JSON.parse(this.responseText);
        counter++;
          if (counter == logMultiSim.length){
            get3SimLog_step2(logMultiSim);
          }else{
            getMultiSimLog(counter, logMultiSim);
          }
      }
    };
    xhr.open("POST", url+"get-sim-log", true);
    xhr.send("{\"customer_no\":\"" + customerNo + "\"}");
  }
  function get3SimLog_step2(logMultiSim){
    var all_colors = ['rgb(181, 25, 58)','rgb(25, 67, 181)','rgb(25, 181, 28)'];

    var all_datas = [];
    var all_smss = [];
    var i;
    for (i=0;i<logMultiSim.length;i++){
        var date_list = [];
        var data_list = [];
        var sms_list = [];
        var j;
        for (j=0;j<logMultiSim[i].length;j++){
            date_list.push(logMultiSim[i][j].date);
            data_list.push(logMultiSim[i][j].data);
            sms_list.push(logMultiSim[i][j].sms);
        }
        var data = {
            label: logMultiSim[i][0].customer_no,
            data: data_list,
            backgroundColor: all_colors[i],
            borderColor: makeColorTransparent(all_colors[i]),
        }
        var sms = {
            label: logMultiSim[i][0].customer_no,
            data: sms_list,
            backgroundColor: all_colors[i],
            borderColor: makeColorTransparent(all_colors[i]),
        }

        all_datas.push(data);
        all_smss.push(sms);
    }
    drawMultiLineChart(date_list, all_datas, multiLineChart1);
    drawMultiLineChart(date_list, all_smss, multiLineChart2);
  }
  function drawMultiLineChart(date_list, all_datas, chart_id) {
    chart_id.data.labels = date_list;
    chart_id.data.datasets = all_datas;
    chart_id.update();

}


  /*************************************************************************************************/
  /*************************************************************************************************/
  /*************************************************************************************************/

function makeColorTransparent(color){
    let n = color.length;
    return color.slice(0,n-1)+", 0.5)";
}



// {"customer_no":"1000000000","sms":"13","data":"92","date":"2021-04-01"}
// {"customer_no":"1000000005","sms":"10","data":"1000","date":"2021-05-29"}