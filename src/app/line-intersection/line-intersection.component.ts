import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Point } from "../interfaces/Point";
import { LineSegment } from "../interfaces/LineSegment";
import JXG from "jsxgraph";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-line-intersection',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './line-intersection.component.html',
  styleUrl: './line-intersection.component.scss'
})
export class LineIntersectionComponent {
  // Definicja punktów końcowych dla dwóch odcinków
  p1: Point = { x: 0, y: 0 };
  q1: Point = { x: 0, y: 0 };
  p2: Point = { x: 0, y: 0 };
  q2: Point = { x: 0, y: 0 };
  result: string = '';

  // Funkcja pomocnicza do sprawdzenia, czy punkt q leży na odcinku pr
  onSegment(p: Point, q: Point, r: Point): boolean {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
      return true;
    }
    return false;
  }

  // Funkcja obliczająca orientację trzech punktów
  orientation(p: Point, q: Point, r: Point): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;  // Punkty współliniowe
    return (val > 0) ? 1 : 2; // Orientacja zgodna z ruchem wskazówek zegara lub przeciwna
  }

  // Główna funkcja sprawdzająca, czy dwa odcinki się przecinają
  doIntersect(line: LineSegment): boolean {
    const { p1, q1, p2, q2 } = line;

    // Obliczenie orientacji dla czterech możliwych zestawów punktów
    const o1 = this.orientation(p1, q1, p2);
    const o2 = this.orientation(p1, q1, q2);
    const o3 = this.orientation(p2, q2, p1);
    const o4 = this.orientation(p2, q2, q1);

    // Sprawdzenie głównego przypadku przecięcia
    if (o1 !== o2 && o3 !== o4) return true;

    // Przypadki współliniowe
    if (o1 === 0 && this.onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && this.onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && this.onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && this.onSegment(p2, q1, q2)) return true;

    return false;
  }

  // Funkcja obliczająca punkt przecięcia dwóch odcinków
  findIntersection(line: LineSegment): Point | null {
    if (!this.doIntersect(line)) return null;

    const { p1, q1, p2, q2 } = line;
    const a1 = q1.y - p1.y;
    const b1 = p1.x - q1.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    const a2 = q2.y - p2.y;
    const b2 = p2.x - q2.x;
    const c2 = a2 * p2.x + b2 * p2.y;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
      return null; // Odcinki są współliniowe
    } else {
      let x: any = ((b2 * c1 - b1 * c2) / determinant).toFixed(1);
      let y: any = ((a1 * c2 - a2 * c1) / determinant).toFixed(1);
      x = Number(x);
      y = Number(y);
      return { x, y };
    }
  }

  // Funkcja sprawdzająca przecięcie i ustawiająca wynik
  checkIntersection(): void {
    const line = { p1: this.p1, q1: this.q1, p2: this.p2, q2: this.q2 };

    // Sprawdzenie, czy wszystkie punkty mają współrzędne (0, 0)
    if (this.p1.x === 0 && this.p1.y === 0 &&
      this.q1.x === 0 && this.q1.y === 0 &&
      this.p2.x === 0 && this.p2.y === 0 &&
      this.q2.x === 0 && this.q2.y === 0) {
      this.result = 'Wszystkie punkty mają współrzędne (0, 0). To nie jest poprawne z perspektywy logiki matematycznej i geometrii, ponieważ nie tworzą rzeczywistych linii.';
      return;
    }

    const doesIntersect = this.doIntersect(line);
    if (doesIntersect) {
      const intersectionPoint = this.findIntersection(line);
      if (intersectionPoint) {
        this.result = `TAK, punkt przecięcia: (${intersectionPoint.x}, ${intersectionPoint.y})`;
      } else {
        this.result = 'TAK, odcinki są współliniowe i mają nieskończenie wiele punktów przecięcia';
      }
    } else {
      this.result = 'NIE, odcinki się nie przecinają';
    }

    this.createGraph();
  }

  // Funkcja resetująca punkty do wartości początkowych
  restPoints(event: Event): void {
    event.preventDefault();
    this.p1 = {x: 0, y: 0}
    this.p2 = {x: 0, y: 0}
    this.q1 = {x: 0, y: 0}
    this.q2 = {x: 0, y: 0}
  }

  // Funkcja rysująca odcinki i punkt przecięcia na wykresie
  createGraph(): void {
    const board = JXG.JSXGraph.initBoard('jxgbox', {
      boundingbox: [-20, 20, 20, -20],
      axis: true
    });

    // Definicja punktów dla każdego odcinka
    const p1 = board.create('point', [this.p1.x, this.p1.y], { visible: false });
    const q1 = board.create('point', [this.q1.x, this.q1.y], { visible: false });
    const p2 = board.create('point', [this.p2.x, this.p2.y], { visible: false });
    const q2 = board.create('point', [this.q2.x, this.q2.y], { visible: false });

    // Rysowanie odcinków
    board.create('segment', [p1, q1], { strokeColor: 'blue', strokeWidth: 2 });
    board.create('segment', [p2, q2], { strokeColor: 'red', strokeWidth: 2 });

    // Znalezienie i oznaczenie punktu przecięcia
    const intersectionPoint = this.findIntersection({ p1: this.p1, q1: this.q1, p2: this.p2, q2: this.q2 });

    if (intersectionPoint) {
      board.create('point', [intersectionPoint.x, intersectionPoint.y], { name: 'punkt przecięcia', size: 4, color: 'green' });
    }
  }
}
