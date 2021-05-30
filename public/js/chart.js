fetch('/chart')
    .then(response => response.json())
    .then(data => {

        let chartData = [{ value: 0, count: 0 }, { value: 0, count: 0 }, { value: 0, count: 0 }];

        if (data.length == 0) {

            //glabal Options
            Chart.defaults.global.defaultFontFamily = 'Oswald'

            let ticketChart = new Chart(myChart, {
                type: 'line', // bar, horozontal, line, doughnut, radar, polararea 
                data: {
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{
                        label: 'Tickets Closed By Priority Averages',
                        data: [],
                        backgroundColor: 'white'
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Team Proficiency',
                        fontSize: 20,
                        fontColor: '#cc683c'
                    },
                    legend: {
                        display: false
                    }
                }
            });
        } else {
            data.forEach(function (el) {
                if (el.priority == 'low') {

                    let total = chartData[0].value;

                    let start = moment(new Date(el.date_added)).format("DD.MM.YYYY HH:mm:ss");
                    let end = moment(new Date(el.date_closed)).format("DD.MM.YYYY HH:mm:ss");

                    let todayDate = moment(start, "DD.MM.YYYY HH:mm:ss");
                    let endDate = moment(end, "DD.MM.YYYY HH:mm:ss");

                    let result = endDate.diff(todayDate, 'hours');
                    total += result;

                    chartData[0].value = total;
                    chartData[0].count++;

                } else if (el.priority == 'medium') {
                    let total = chartData[1].value;

                    let start = moment(new Date(el.date_added)).format("DD.MM.YYYY HH:mm:ss");
                    let end = moment(new Date(el.date_closed)).format("DD.MM.YYYY HH:mm:ss");

                    let todayDate = moment(start, "DD.MM.YYYY HH:mm:ss");
                    let endDate = moment(end, "DD.MM.YYYY HH:mm:ss");

                    let result = endDate.diff(todayDate, 'hours');
                    total += result;

                    chartData[1].value = total;
                    chartData[1].count++;

                } else {
                    let total = chartData[2].value;

                    let start = moment(new Date(el.date_added)).format("DD.MM.YYYY HH:mm:ss");
                    let end = moment(new Date(el.date_closed)).format("DD.MM.YYYY HH:mm:ss");

                    let todayDate = moment(start, "DD.MM.YYYY HH:mm:ss");
                    let endDate = moment(end, "DD.MM.YYYY HH:mm:ss");

                    let result = endDate.diff(todayDate, 'hours');
                    total += result;

                    chartData[2].value = total;
                    chartData[2].count++;
                }

            });

            console.log(chartData);

            // Mutate array to averages of closed tickets per each priority
            chartData.forEach((el, index) => {
                if (index == 0) {
                    chartData[index].value = el.value / el.count;
                }
                else if (index == 1) {
                    chartData[index].value = el.value / el.count;
                }
                else {
                    chartData[index].value = el.value / el.count;
                }
            });

            console.log(chartData);


            const chartValues = chartData.map(({ value }) => {
                return value.toFixed(2)
            });

            let myChart = document.getElementById('myChart').getContext('2d');

            //glabal Options
            Chart.defaults.global.defaultFontFamily = 'Oswald'

            let ticketChart = new Chart(myChart, {
                type: 'bar', // bar, horozontal, line, doughnut, radar, polararea 
                data: {
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{
                        label: ['Average time of tickets solved (in hours)'],
                        data: chartValues,
                        borderWidth: 1,
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)'

                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)'

                        ]
                    }]
                },

                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Team Proficiency of Issues Solved',
                        fontSize: 25,
                        fontColor: '#232328'
                    },
                    legend: {
                        display: true,
                        labels: {
                            boxWidth: 0,
                        }
                    },
                    scales: {
                        yAxes: [{
                            display: true,
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                min: 0, // minimum value
                                max: 48, // maximum value
                                maxTicksLimit: 48
                            },
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    plugins: {
                        // Change options for ALL labels of THIS CHART
                        datalabels: {
                            color: ['rgba(255, 206, 86, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
                            anchor: 'center'
                        }
                    }
                }

            });
        }

    })
    .catch(error => console.error(error));













