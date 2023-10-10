import { createElement, useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { HelloWorldSample } from "./components/HelloWorldSample";

export default function GradientColumnChart({ data, title }) {
    const [xdata, setXData] = useState([]);
    const [ydata, setYData] = useState([]);
    const [DynamicHeight, setDynamicHeight] = useState(-1);
    const [DynamicWidth, setDynamicWidth] = useState(-1);
    const observerDiv = useRef(null);
    const getSymbol = item => {
        const symbols = Object.getOwnPropertySymbols(item);
        const mxSymbol = symbols.find(symbol => symbol.toString() === "Symbol(mxObject)");
        return mxSymbol;
    };
    const getMXValues = attr => {
        const x = data.items.map(item => {
            const mySymbol = getSymbol(item);
            return item[mySymbol].jsonData.attributes[attr].value;
        });
        return x;
    };
    useEffect(() => {
        if (data.status === "available") {
            const ValuesName = getMXValues("LATETYPE");
            const Values = getMXValues("NOT_LATE");
            setXData(ValuesName);
            setYData(Values);
        }
    }, [data?.status]);

    const buildChart = () => {
        const chartDom = document.getElementById("chart-container");
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: title ? title : ""
            },
            xAxis: {
                data: xdata,
                axisLabel: {
                    inside: true,
                    color: "#fff"
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#999"
                }
            },
            dataZoom: [
                {
                    type: "inside"
                }
            ],
            series: [
                {
                    type: "bar",
                    showBackground: true,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#E1D4A3" },
                            { offset: 0.5, color: "#D4A3E1" },
                            { offset: 1, color: "#188df0" }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: "#E1D4A3" },
                                { offset: 0.7, color: "#E1D4A3" },
                                { offset: 1, color: "#E1A3CF" }
                            ])
                        }
                    },
                    data: ydata
                }
            ]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option);
        }
    };

    useEffect(() => {
        if (!observerDiv.current || ydata.length === 0) return;

        const numDataPoints = ydata.length;
        const DynamicWidthValue = 300 + numDataPoints * 20;
        const DynamicHeightValue = 300 + numDataPoints * 20 + 100;

        setDynamicWidth(DynamicWidthValue);
        setDynamicHeight(DynamicHeightValue);
        setTimeout(() => {
            buildChart();
        }, 500);
    }, [xdata, ydata]);

    return <div id="chart-container" style={{ height: DynamicHeight, width: DynamicWidth }} ref={observerDiv}></div>;
}
