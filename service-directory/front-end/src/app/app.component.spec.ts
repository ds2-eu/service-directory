import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ConfigService } from './core/config';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [AppModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            config: {
              backend: 'https://wasp-service-directory-api.test.icelab.cloud',
            },
            load: async () => {},
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should have DOM elements', () => {
    fixture.detectChanges();
    expect(element).toBeTruthy();
    expect(element.innerHTML).toBeTruthy();
    expect(element.querySelector('router-outlet')).toBeTruthy();
  });
});
