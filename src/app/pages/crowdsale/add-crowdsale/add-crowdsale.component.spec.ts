import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrowdsaleComponent } from './add-crowdsale.component';

describe('AddCrowdsaleComponent', () => {
  let component: AddCrowdsaleComponent;
  let fixture: ComponentFixture<AddCrowdsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrowdsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrowdsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
