(function() {
    var mtargetUrl = 'test/mtarget.json';

    Vue.filter('toPercent', function(value) {
        return (Math.round(value * 10000) / 100).toFixed(2) + '%';
    });

    Vue.component('c-mtarget', {
        template: '#cmtarget',
        props: {
            myMtarget: {
                type:Object,
                required:true
            },
            myIndex:{
                type:Number,
                required:true
            }
        },
        data: function() {

            var targetname = this.myMtarget.targetname;
            var statinfo = this.myMtarget.statinfo;
            var linechart = this.myMtarget.linechart;
            var barchart = this.myMtarget.barchart;
            return {
                targetname: targetname,
                statinfo: statinfo,
                linechart: linechart,
                barchart: barchart,
                linechartId:'linechart'+ this.myIndex,
                barchartId :'barchart'+ this.myIndex,
            }
        },


        compiled: function() {
            //在编译结束后调用。此时所有的指令已生效，因而数据的变化将触发 DOM 更新。但是不担保 $el 已插入文档。
            //TODO echart 先setoption

        },

        ready: function() {
            console.log("c-mtarget ready");



            //linechart
            this.drawLineChart(this.$data.linechartId, this.formChartTittle(this.$data.targetname,'line'), this.$data.linechart);

            //barchart
            this.drawBarChart(this.$data.barchartId, this.formChartTittle(this.$data.targetname,'bar'), this.$data.barchart);

        },

        methods: {

            drawLineChart: function(elem, title, linechart) {

                var myChart = echarts.init(document.getElementById(elem));
                myChart.setOption({
                    title: {
                        text: title,
                        left: 'left',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            fontFamily:'Arial Normal',

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


                // 月度计划
                var planList = linechart.monthlyPlanList;

                // 月度实际
                var actualList = linechart.monthlyList;

                // 月度预测
                var predictList = [];
                for (var i = actualList.length; i < 12; i++) {
                    predictList[i] = linechart.monthlyPreList[i - actualList.length];
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
                });
            },


            drawBarChart: function(elem, title, barchart) {
                var myChart = echarts.init(document.getElementById(elem));
                myChart.setOption({
                    title: {
                        text: title,
                        left: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            fontFamily:'Arial Normal',

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

                // 去年月度
                var lastyearMonthlyList = barchart.lastyearMonthlyList;

                // 今年月度
                var monthlyList = barchart.monthlyList;

                // 今年月度实际发电量/上网电量数组长度可能不到12 补全
                for (var j = monthlyList.length; j < 12; j++) {
                    monthlyList.push(null);
                }

                myChart.setOption({

                    legend: {
                        data: [{
                            name: barchart.lastYear,
                            icon: ''
                        }, {
                            name: barchart.year,
                            icon: ''
                        }]
                    },

                    series: [{
                        name: barchart.lastYear,
                        type: 'bar',
                        data: lastyearMonthlyList,
                        itemStyle: {
                            normal: {
                                color: 'rgb(144,237,125)'
                            }
                        }

                    }, {
                        name: barchart.year,
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

            },

            formChartTittle:function(targetname, type){
                if(type === 'bar'){
                    return '本年同期月度'+targetname+'对比';
                }else if (type === 'line'){
                    return '年计划'+targetname+'、月度计划折算'+targetname;
                }else {
                    return;
                }
            }

        },
    });


    var demo = new Vue({
        el:'#content',
        data:{
            mtargets:[]
        },

        ready:function(){
            var self = this;
            $.getJSON(mtargetUrl,function(response){
                console.log(response);
                self.$data = response.data.cli.dps;
            })
        }
    })


})()
