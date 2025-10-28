import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import html2canvas from 'html2canvas';
import { delay, from, map, Observable, tap } from 'rxjs';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxExtendedPdfViewerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'pdf-viewr-screenshot';

  public screenshot: string | undefined;

  constructor(private cd: ChangeDetectorRef) {}

  public makeScreenshot(): void {
    this.screenshot = undefined;
    const canvasPdf: HTMLCanvasElement | null = document.querySelector(
      '.canvasWrapper canvas'
    );

    if (canvasPdf) {
      const img = new Image();

      img.onload = () => {
        // img.style.width = `${canvasPdf.parentElement?.clientWidth || 0}px`;
        // img.style.height = `${canvasPdf.parentElement?.clientHeight || 0}px`;
        // img.style.display = 'none';
        // document.body.appendChild(img)
      };

      img.src = canvasPdf.toDataURL('image/png', 0.6);
    }

    from(
      html2canvas(document.body, {
        useCORS: true,
        scrollY: 0,
        allowTaint: false,
        foreignObjectRendering: true,
        scale: 1,
        logging: true,
        ignoreElements(element: Element) {
          return element.classList.contains('screenshot-container');
        },
        onclone(doc: Document) {
          (doc.querySelector(
            '.pdfViewer .page'
          ) as HTMLDivElement)!.style.borderImage = 'none';

          //  console.log(doc.querySelector('.pdfViewer .canvasWrapper img'));
          //  debugger;
        },
      })
    )
      .pipe(
        tap((canvas: HTMLCanvasElement) => {
          document.body.appendChild(canvas)
        }),
        // map((canvas: HTMLCanvasElement) => {
        //   return canvas.toDataURL();
        // }),
        // tap((screenshot: string) => {
        //   this.screenshot = screenshot;
        // })
      )
      .subscribe();
  }
}
