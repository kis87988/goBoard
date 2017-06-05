/* tslint:disable:no-unused-variable */
import { HomePageComponent } from '../src/app/home-page/home-page.component';

import { expect } from 'chai';
import 'mocha';

describe('HomePageComponent', () => {
  let component: HomePageComponent;

  it('should set debug to false', () => {
    expect(component.debugGetter()).to.equal(false);
  });
});
