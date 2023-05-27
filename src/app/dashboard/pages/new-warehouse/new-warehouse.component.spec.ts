import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWarehouseComponent } from './new-warehouse.component';

describe('NewWarehouseComponent', () => {
  let component: NewWarehouseComponent;
  let fixture: ComponentFixture<NewWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWarehouseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
