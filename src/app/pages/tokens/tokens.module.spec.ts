import { TokensModule } from './tokens.module';

describe('TokensModule', () => {
  let tokensModule: TokensModule;

  beforeEach(() => {
    tokensModule = new TokensModule();
  });

  it('should create an instance', () => {
    expect(tokensModule).toBeTruthy();
  });
});
