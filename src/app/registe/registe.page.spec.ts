import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistePage } from './registe.page';

describe('RegistePage', () => {
  let component: RegistePage;
  let fixture: ComponentFixture<RegistePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
