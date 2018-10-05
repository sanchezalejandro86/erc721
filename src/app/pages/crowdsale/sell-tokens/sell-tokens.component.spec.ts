import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellTokensComponent } from './sell-tokens.component';

describe('SellTokensComponent', () => {
  let component: SellTokensComponent;
  let fixture: ComponentFixture<SellTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
