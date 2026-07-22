import { ElementRef } from '@angular/core';
import { ImgRetryDirective } from './img-retry.directive';

describe('ImgRetryDirective', () => {
  let img: { src: string };
  let dir: ImgRetryDirective;

  beforeEach(() => {
    jasmine.clock().install();
    img = { src: 'https://cdn.test/kamak-fotos/obras/x/web/foto.png' };
    dir = new ImgRetryDirective(new ElementRef(img as HTMLImageElement));
  });

  afterEach(() => {
    dir.ngOnDestroy();
    jasmine.clock().uninstall();
  });

  it('reintenta con cache-buster kr=1 tras el primer error', () => {
    dir.onError();
    expect(img.src).toBe('https://cdn.test/kamak-fotos/obras/x/web/foto.png');
    jasmine.clock().tick(5000);
    expect(img.src).toBe('https://cdn.test/kamak-fotos/obras/x/web/foto.png?kr=1');
  });

  it('incrementa kr en cada reintento y frena tras 3 intentos', () => {
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=1');
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=2');
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=3');
    dir.onError();
    jasmine.clock().tick(10000);
    expect(img.src).toContain('?kr=3');
  });

  it('usa & si la URL ya tiene query params', () => {
    img.src = 'https://cdn.test/foto.png?width=740';
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toBe('https://cdn.test/foto.png?width=740&kr=1');
  });

  it('resetea el contador cuando cambia el src (otra imagen)', () => {
    dir.onError();
    jasmine.clock().tick(5000);
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=2');
    img.src = 'https://cdn.test/otra.png';
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toBe('https://cdn.test/otra.png?kr=1');
  });

  it('resetea el contador cuando la imagen carga bien', () => {
    dir.onError();
    jasmine.clock().tick(5000);
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=2');
    dir.onLoad();
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toContain('?kr=1');
  });

  it('NO pisa el src si cambió mientras esperaba el reintento (lightbox)', () => {
    dir.onError();
    img.src = 'https://cdn.test/foto-siguiente.png';
    jasmine.clock().tick(5000);
    expect(img.src).toBe('https://cdn.test/foto-siguiente.png');
  });

  it('ignora imágenes sin src o data-uri', () => {
    img.src = '';
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toBe('');
    img.src = 'data:image/png;base64,AAAA';
    dir.onError();
    jasmine.clock().tick(5000);
    expect(img.src).toBe('data:image/png;base64,AAAA');
  });
});
