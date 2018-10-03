import { CrowdsaleModule } from './crowdsale.module';

describe('CrowdsaleModule', () => {
  let crowdsaleModule: CrowdsaleModule;

  beforeEach(() => {
    crowdsaleModule = new CrowdsaleModule();
  });

  it('should create an instance', () => {
    expect(crowdsaleModule).toBeTruthy();
  });
});
