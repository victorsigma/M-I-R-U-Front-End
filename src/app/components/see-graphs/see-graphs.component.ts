import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, LineController, BarElement, BarController } from 'chart.js'; // Import the necessary components
import { Age, Sexo, Stadistic } from 'src/app/models/graph';
import { ModelsService } from 'src/app/services/models.service';
import { ColorSk } from '../../models/graph';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, BarController, BarElement); // Register all necessary components

@Component({
  selector: 'app-see-graphs',
  templateUrl: './see-graphs.component.html',
  styleUrls: ['./see-graphs.component.css']
})
export class SeeGraphsComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined; // Changed to Chart type
  lineSeries: any;
  graphValues: Array<{ time: any; value: number }> = [];

  private resizeObserver: ResizeObserver | undefined;

  public options: 'Modelos' | 'Sexo' | 'Edad' | 'Color' = 'Modelos';

  private gender!: Sexo;
  private age!: Age;
  private color!: ColorSk;

  constructor(
    private modelsService: ModelsService
  ) {
    this.modelsService.getModelGraph().subscribe((data) => {
      // Convert model names to a numerical format
      this.graphValues = data.map((value) => ({
        time: this.extractTime(value.created_at), // Convertir a marca de tiempo Unix
        value: value.model_score
      }));

      // Crear el gráfico y actualizar el tamaño con los nuevos datos
      if (this.chart) {
        this.createChart();
        this.updateChartSize();
      }
    });

    this.modelsService.getStadistics().subscribe((data: Stadistic) => {
      this.gender = data.sexo;
      this.age = data.edad;
      this.color = data.color_piel;
    })
  }

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          this.updateChartSize();
        }
      }
    });
    this.createChart();

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  extractTime(dateTime: string): number {
    return new Date(dateTime).getTime() / 1000; // Convertir a segundos
  }

  updateChartSize(): void {
    if (this.chart) {
      this.graphValues.sort((a, b) => a.time - b.time); // Ordenar por tiempo
      this.createChart();
    }
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart before creating a new one
    }

    const ctx = document.getElementById('ctx');;

    if (this.options == 'Modelos') {
      this.chart = new Chart('ctx', {
        type: 'line',
        data: {
          labels: this.graphValues.map(v => new Date(v.time * 1000).toLocaleDateString()), // Convert time to readable format
          datasets: [{
            label: 'Model Scores',
            data: this.graphValues.map(v => v.value),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              type: 'category',
              position: 'bottom'
            },
            y: {
              type: 'linear',
              beginAtZero: true
            }
          }
        }
      });
    }

    if (this.options == 'Sexo') {
      this.chart = new Chart('ctx', {
        type: 'bar',
        data: {
          datasets: [{
            data: [this.gender.M, this.gender.F],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          }],
          labels: ['Masculino', 'Femenino']
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Genero'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad'
              },
              beginAtZero: true
            }
          }
        }
      });
    }

    if (this.options == 'Edad') {
      this.chart = new Chart('ctx', {
        type: 'bar',
        data: {
          datasets: [{
            data: [this.age.infante, this.age.adolecente, this.age['adulto joven'], this.age.adulto, this.age['adulto mayor']],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          }],
          labels: ['Infantes', 'Adolecentes', 'Adultos Jovenes', 'Adultos', 'Adultos Mayores', ]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Edades'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad'
              },
              beginAtZero: true
            }
          }
        }
      });
    }

    if (this.options == 'Color') {
      this.chart = new Chart('ctx', {
        type: 'bar',
        data: {
          datasets: [{
            data: [this.color.blanco, this.color.negro, this.color.moreno],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          }],
          labels: ['Blanco', 'Negro', 'Moreno' ]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Edades'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Tonos de Piel'
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  downloadChartAsPDF(): void {
    const canvas = this.chartCanvas.nativeElement;
    html2canvas(canvas, { useCORS: true, backgroundColor: null }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('chart.pdf');
    }).catch(error => {
      console.error('Error generating PDF:', error);
    });
  }
}
