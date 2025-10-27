import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import html2canvas from 'html2canvas';
import { from, map, Observable, tap } from 'rxjs';
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

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  public makeScreenshot(): void {
    from(
      html2canvas(document.body, {
        useCORS: true,
        scrollY: 0,
        allowTaint: true,
        foreignObjectRendering: true,
        scale: 1,
      })
    ).pipe(
      map((canvas: HTMLCanvasElement) => canvas.toDataURL()),
      tap((screenshot: string) => {
        this.screenshot = screenshot;
        this.cd.detectChanges();
      })
    )
    .subscribe();
  }
}
