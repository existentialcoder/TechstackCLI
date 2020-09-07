const { mockProcessExit } = require('jest-mock-process');
const CLI = require('.');

describe('Tech stack CLI', () => {
  // eslint-disable-next-line
  CLI.getTechResponse = jest.fn();
  it('prints tech stack for a valid link', async () => {
    CLI.getTechResponse.mockResolvedValueOnce({
      la: 'La',
    });
    console.log(CLI.techstackCLI);
    await CLI.techstackCLI(['https://www.freshdesk.com']);
  });
});
