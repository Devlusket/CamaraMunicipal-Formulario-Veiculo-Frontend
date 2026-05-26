import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  templateUrl: './signature-pad.component.html',
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() assinaturaChange = new EventEmitter<string | null>();

  private signaturePad!: SignaturePad;
  vazio = true;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ajustarCanvas(canvas);

    this.signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(30, 58, 138)', // azul institucional
    });

    this.signaturePad.addEventListener('beginStroke', () => {
      this.vazio = false;
    });

    this.signaturePad.addEventListener('endStroke', () => {
      this.assinaturaChange.emit(this.signaturePad.toDataURL('image/png'));
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.canvasRef) {
      this.ajustarCanvas(this.canvasRef.nativeElement);
      this.signaturePad?.clear();
      this.vazio = true;
      this.assinaturaChange.emit(null);
    }
  }

  limpar(): void {
    this.signaturePad.clear();
    this.vazio = true;
    this.assinaturaChange.emit(null);
  }

  private ajustarCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
  }
}