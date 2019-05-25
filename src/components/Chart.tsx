import * as React from 'react'
import { connect } from 'react-redux'
import ChartJs from 'chart.js'
import { CheckBox } from './CheckBox'


import { AppState } from "../store";

interface ChartProps {
   title: string,
   info: any,
}

const labels: any = []
const datasets: any = []
const axises: any = []

class Chart extends React.Component<ChartProps> {
   state = {
      title: '',
      info: {
         file: [],
         readingFile: false
      },
      chart: {
         data: {
            labels: labels,
            datasets: datasets,
         },
         reset: () => { },
         destroy: () => { },
         update: () => { },
         options:{
            scales:{
               yAxes: axises,
            }
         }
      },
      linearScaleOptions: [{
         id: 'y-axis-0',
         display: true,
         type: 'linear',
         position: 'left',
      }],
      logarithmicScaleOptions: [{
         id: 'y-axis-0',
         display: true,
         type: 'logarithmic',
         position: 'left',
      }],
   }

   getBuckets(data: Array<any>, size: number) {
      let bucketSize = Math.round((data.length / 2) / size)
      let count = 0
      let bucket: any = []
      let buckets: any = []
      data.forEach(point => {
         if (count < bucketSize) {
            count++
            bucket.push(point)
         }
         else {
            buckets.push(bucket)
            count = 0
            bucket = []
         }
      })
      bucket = []
      return buckets
   }

   componentDidMount() {
      this.initChart()
   }

   pushData(label: string, data: any) {
      return new Promise((resolve, reject) => {
         if (!this.state.chart) {
            return reject();
         }
         this.state.chart.data.labels.push(label)
         this.state.chart.data.datasets.forEach((dataset: any) => {
            dataset.data.push(data)
         })
         resolve(true)
      })
   }

   popData() {
      return new Promise((resolve, reject) => {
         this.state.chart.data.labels.forEach((label: any) => {
            this.state.chart.data.labels.pop()
         })
         this.state.chart.data.datasets.forEach((dataset: any) => {
            dataset.data.forEach((data: any, i: number) => {
               dataset.data.pop()
               if (i === dataset.data.length - 1) {
                  resolve(true)
               }
            })
         })
      })
   }

   initChart() {
      let op = 1.0
      let lineColor = ['rgba(0, 0, 0, ' + op + ')']
      let scaleOptions = this.props.info.chartSettings.scaleType === 'linear' ? this.state.linearScaleOptions : this.state.logarithmicScaleOptions
      let body = {
         type: 'line',
         data: {
            labels: ["group 1"],
            datasets: [
               {
                  borderWidth: 1,
                  label: "Curve Data",
                  data: [1],
                  borderColor: lineColor,
                  backgroundColor: ['rgba(255,255,255, 1.0)'],
                  pointStyle: 'circle' as 'circle',
                  pointRadius: 2,
                  pointBackgroundColor:  'black',
                  fill: false,
               }
            ]
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: scaleOptions
            }
         }
      }
      let ctx = null
      if (this.state.chart) {
         this.state.chart.destroy()
         this.setState({ chart: null })
      }

      if (document.getElementById("myChart")) {
         let el: any = document.getElementById("myChart");
         ctx = el.getContext("2d")
         this.setState({ chart: new ChartJs(ctx, body) })
      }
   }

   render() {
      let curveIndex = -1
      if (this.props.info.file.CURVE_INFORMATION) {
         let curves = Object.keys(this.props.info.file.CURVE_INFORMATION)
         curves.forEach((curve, i) => {
            if (curve === this.props.info.file.chartCurve)
               curveIndex = i
         })
      }

      let style = {
         height: '80vh' as '80vh',
         width: '80%' as '80%',
         position: 'relative' as 'relative',
         margin: 'auto' as 'auto',
      }
      if (this.props.info.readingFile && this.state.chart) {
         this.popData().then(() => {
            this.state.chart.update()
         })
      }
      else if (this.state.chart && curveIndex >= 1) {
         this.state.chart.data.datasets.forEach((set:any) => {
            set.data = []
         })
         this.state.chart.data.labels = []
         //copy the data
         let data = [...this.props.info.file.ASCII.data]
         //get our data
         let ourLabels = data.map(line => {
            return line[0]
         })
         let ourPoints = data.map((line: any )=> 
            parseFloat(line[curveIndex]) !== -999.25 ? parseFloat(line[curveIndex]) : undefined)


         let factor = 5
         if (ourLabels.length > window.innerWidth / factor) {
            //bucket them
            let labelBuckets = this.getBuckets(ourLabels, window.innerWidth / (factor * 2))
            let pointsBuckets = this.getBuckets(ourPoints, window.innerWidth / (factor * 2))
            let pointsMinMax: any = []
            let labelsMinMax: any = []
            pointsBuckets.forEach((bucket:any) => {
               let arMax = bucket.reduce((total:any, point:any) => {
                  return point === undefined ? total : total === undefined ? total : total > point ? total : point
               })
               let arMin = bucket.reduce((total:any, point:any, i: number) => {
                  return point === undefined ? total : total === undefined ? total : i === 0 ? point : total < point ? total : point
               })
               pointsMinMax.push(arMin)
               pointsMinMax.push(arMax)
            })
            labelBuckets.forEach((bucket: any) => {
               let i = Math.round(bucket.length > 1 ? bucket.length / 2 : 0)
               labelsMinMax.push(bucket[0])
               labelsMinMax.push(bucket[i])
            })

            data = pointsMinMax
            ourLabels = labelsMinMax
         }
         else {
            data = ourPoints
         }
         if (data.length > 0) {
            if (this.props.title !== this.state.title) {
               this.state.title = this.props.title
               this.state.chart.reset()
            }
            ourLabels.map(label => 
               this.state.chart.data.labels.push(parseFloat(label))
            )
            this.state.chart.data.datasets.forEach((set:any) => {
               data.map(point => 
                  set.data.push(point)
               )
               let ci = this.props.info.file.CURVE_INFORMATION[this.props.info.file.chartCurve]
               set.label = ci.mnem + ' ' + ci.unit
               let { r, g, b, rr, gg, bb } = this.getNewColors()
               set.borderColor = ['rgba(' + r + ', ' + g + ', ' + b + ', 1.0)']
               set.backgroundColor = ['rgba(' + rr + ', ' + gg + ', ' + bb + ', 1.0)']
               if (this.state.chart) {
                  if (this.props.info.chartSettings.scaleType !== this.state.chart.options.scales.yAxes[0].type) {
                     let scaleOptions = this.props.info.chartSettings.scaleType === 'linear' ? this.state.linearScaleOptions : this.state.logarithmicScaleOptions
                     this.state.chart.options.scales.yAxes = ChartJs.helpers.scaleMerge(ChartJs.defaults.scale, { yAxes: scaleOptions }).yAxes
                  }
               }
               this.state.chart.update()
            })
         }
      }
      return (
         <div>
            <div style={style}>
               <CheckBox />
               <canvas id="myChart" style={style}></canvas>
            </div>
         </div >
      )
   }

   getNewColors() {
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);
      let rr = 255 - r;
      let gg = 255 - g;
      let bb = 255 - b;
      return { r, g, b, rr, gg, bb };
   }
}

const mapStateToProps = (state: AppState) => {
   return ({
      title: state.files.name,
      info: {
         file: state.files,
         chartSettings: state.chart,
      }
   })
}

const connected = connect(
   mapStateToProps,
   {},
)(Chart)
export { connected as Chart };
