(function() {

    Vue.filter('toPercent', function(value) {
        return (Math.round(value * 10000) / 100).toFixed(2) + '%';
    });

    $(function() { //jquery ready $.getJSON


        //调用6个接口
        //
        //
        drawLineChart('ongridLinechart',
            'test/ongridLineChart.json', '年计划上网电量、月度计划折算上网电量', 'ongridEnergyLineChart');
        drawLineChart('genEnergyLinechart',
            'test/genEnergyLineChart.json', '年计划上网电量、月度计划折算上网电量', 'genEnergyLineChart');

        /////
       /* drawBarChart('ongridBarchart',
            'test/ongridBarChart.json', '本年同期月度上网电量对比', 'ongridEnergyBarChart');

        drawBarChart('genEnergyBarchart',
            'test/genEnergyBarChart.json', '本年同期月度发电量对比', 'genEnergyBarChart');

        new Vue({
            el: '#ongridStat',
            data: function() {
                return {
                    typeName: '上网',
                }
            },
            compiled: function() {
                console.log('init');
                this.getStatInfo('test/ongridStatInfo.json');

            },
            methods: {
                getStatInfo: function(url) {
                    var self = this;
                    var statData = {};
                    $.getJSON(url, function(response) {
                        console.log(response);
                        statData = response.data.cli.dps.ongridEnergyStat
                        statData.typeName='上网';
                        self.$data = statData;
                    });
                },
            }
        });

        new Vue({
            el: '#genEnergyStat',
            data: function() {
                return {
                    typeName: '发',
                }
            },
            compiled: function() {
                console.log('init genEnergyStat');
                this.getStatInfo('test/genEnergyStatInfo.json');

            },
            methods: {
                getStatInfo: function(url) {
                    var self = this;
                    var statData = {};

                    $.getJSON(url, function(response) {
                        console.log("============start");
                        console.log(response);
                        console.log("============end");
                        statData = response.data.cli.dps.genEnergyStat
                        statData.typeName='发';
                        self.$data = statData;
                    });
                },
            }
        });*/




    })


    function drawLineChart(elem, url, title, jsonEleName) {

        var myChart = echarts.init(document.getElementById(elem));
        myChart.setOption({
            title: {
                text: title,
                left: 'left',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 15

                },
                padding: [
                    5, // 上
                    10, // 右
                    5, // 下
                    20, // 左
                ]
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            legend: {
                left: 'center',
                bottom: '0px',
                data: [{
                    name: '实际',
                    icon: ''
                }, {
                    name: '计划',
                    icon: ''
                }, {
                    name: '预测',
                    icon: ''
                }]
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: 'MWh',
                nameLocation: 'middle',
                nameGap: '35',
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: ['#ccc'],
                        width: 1
                    }
                },
                max: 600,
                min: 0,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 10 //最小就是12 设置10 和12 好像没差别
                    }
                }
            },
            series: [{
                name: '实际',
                type: 'line',
                data: [],
                // data:[129,212,1212,1212,,,,,,,,,],
                lineStyle: {
                    normal: {
                        color: 'rgb(244,91,91)',
                        width: 2
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 6
                        }
                    }
                }
            }, {
                name: '计划',
                type: 'line',
                data: [],
                lineStyle: {
                    normal: {
                        color: 'rgb(128,133,233)',
                        width: 2
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 6
                        }
                    }
                }
            }, {
                name: '预测',
                type: 'line',
                data: [],
                lineStyle: {
                    normal: {
                        color: 'rgb(6,254,6)',
                        width: 2,
                        type: 'dashed'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 6
                        }
                    }
                }
            }]
        });




        //TODO　linechart api
        $.getJSON(url, function(response) {
            console.log(response.data);

            var dps = response.data.cli.dps;
            var lineChart = dps[jsonEleName];

            $("#"+elem+"YawRate").html((Math.round(lineChart.deviationRate * 10000) / 100).toFixed(0) + '%');


            // 月度计划
            var planList = lineChart.monthlyPlanList;

            // 月度实际
            var actualList = lineChart.monthlyList;

            // 月度预测
            var predictList = [];
            for (var i = actualList.length; i < 12; i++) {
                predictList[i] = lineChart.monthlyPreList[i - actualList.length];
            }

            // 月度实际发电量/上网电量数组长度可能不到12 补全
            for (var j = actualList.length; j < 12; j++) {
                actualList.push(null);
            }
            myChart.setOption({
                series: [{
                    name: '实际',
                    type: 'line',
                    data: actualList,

                }, {
                    name: '计划',
                    type: 'line',
                    data: planList,

                }, {
                    name: '预测',
                    type: 'line',
                    data: predictList,

                }]
            })
        });
    }


    /**
     * [drawBarChart description]
     * @param  {[type]} elem        [description]
     * @param  {[type]} url         [description]
     * @param  {[type]} title       [description]
     * @param  {[type]} jsonEleName [description]
     * @return {[type]}             [description]
     */
    function drawBarChart(elem, url, title, jsonEleName) {
        var myChart = echarts.init(document.getElementById(elem));
        myChart.setOption({
            title: {
                text: title,
                left: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 15

                },
                padding: [
                    25, // 上
                    10, // 右
                    5, // 下
                    20, // 左
                ]
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            legend: {
                left: 'center',
                bottom: '0px',
                data: []
            },
            xAxis: {
                type: 'category',
                splitLine: { show: false },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: 'MWh',
                nameLocation: 'middle',
                nameGap: '35',
                axisLine: { show: false },
                splitLine: {
                    lineStyle: {
                        color: ['#ccc'],
                        width: 1
                    }
                }
            },
            series: [],
            tooltip: {
                show: true,
                formatter: '{a}-{b}: {c}MWh'
            }
        });

        //TODO　linechart api
        $.getJSON(url, function(response) {
            console.log(response);
            var dps = response.data.cli.dps;

            var barChart = dps[jsonEleName];

            // 去年月度
            var lastyearMonthlyList = barChart.lastyearMonthlyList;

            // 今年月度
            var monthlyList = barChart.monthlyList;

            // 今年月度实际发电量/上网电量数组长度可能不到12 补全
            for (var j = monthlyList.length; j < 12; j++) {
                monthlyList.push(null);
            }

            myChart.setOption({

                legend: {
                    data: [{
                        name: barChart.lastYear,
                        icon: ''
                    }, {
                        name: barChart.year,
                        icon: ''
                    }]
                },

                series: [{
                    name: barChart.lastYear,
                    type: 'bar',
                    data: lastyearMonthlyList,
                    itemStyle: {
                        normal: {
                            color: 'rgb(144,237,125)'
                        }
                    }

                }, {
                    name: barChart.year,
                    type: 'bar',
                    data: monthlyList,
                    itemStyle: {
                        normal: {
                            color: 'rgb(247,163,92)'
                        }
                    },
                    barGap: '30%',
                    barCategoryGap: '50%'

                }]
            });

        })

    }









    var baseInfo = {
        ongrid: {
            name: '上网',
            value: 'ongrid'
        },
        genEnergy: {
            name: '发',
            value: 'genEnergy'
        }
    }

})()
