jest.mock('postcss-value-parser');

const postcssValueParser = require('postcss-value-parser');
const ThemeableVariableInformation = require('../../../../../../config/webpack/themeable-variable-linter/private/ThemeableVariableInformation');
const ThemeableVariableCollectorPlugin = require('../../../../../../config/webpack/themeable-variable-linter/private/ThemeableVariableCollectorPostCSSPlugin');

describe('Themeable Variable Collector Plugin', () => {
  it('populates the list of themeable variables', () => {
    const themeableVariableInformation = new ThemeableVariableInformation(['default', 'a', 'b']);
    const plugin = ThemeableVariableCollectorPlugin(themeableVariableInformation);

    const mockVarNode1 = {
      type: 'function',
      value: 'var',
      nodes: [{
        value: '--var1',
      }],
    };

    const mockVarNode2 = {
      type: 'function',
      value: 'var',
      nodes: [{
        value: '--var2',
      }],
    };

    const mockNonVarNode = {
      type: 'function',
      value: 'something other than a var',
      nodes: [{
        value: 'something',
      }],
    };

    const mockNonFunctionNode = {
      type: 'nonfunction',
      value: 'var',
      nodes: [{
        value: 'something',
      }],
    };

    postcssValueParser.mockReturnValue({
      walk: jest
        .fn()
        .mockImplementation(func => {
          func(mockVarNode1);
          func(mockVarNode2);
          func(mockNonVarNode);
          func(mockNonFunctionNode);
        }),
    });

    const mockDeclaration = {
      value: 'declaration value',
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };
    const mockRoot = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDeclaration);
        }),
      walkRules: () => {},
    };

    plugin(mockRoot);

    expect(themeableVariableInformation).toMatchSnapshot();
    expect(postcssValueParser).toBeCalledWith('declaration value');
  });

  it('populates the list of tracked variables', () => {
    const themeableVariableInformation = new ThemeableVariableInformation(['default', 'a', 'b']);
    const plugin = ThemeableVariableCollectorPlugin(themeableVariableInformation);

    const mockDecl1 = {
      prop: '--var1',
      value: 1,
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };

    const mockDecl2 = {
      prop: '--var2',
      value: 2,
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };

    const mockDecl2Dup = {
      prop: '--var2',
      value: 3,
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };

    const mockDecl3 = {
      prop: '--var3',
      value: 3,
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };

    const mockDecl3NonDup = {
      prop: '--var3',
      value: 3,
      source: {
        start: {
          line: 1,
          column: 1,
        },
        input: {
          origin: () => (
            {
              file: 'file1',
              line: 1,
              column: 1,
            }
          ),
        },
      },
    };

    const mockDefaultNode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
          func(mockDecl2);
          func(mockDecl3);
        }),
    };
    const mockANode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
        }),
    };
    const mockBNode = {
      walkDecls: jest
        .fn()
        .mockImplementation(func => {
          func(mockDecl1);
          func(mockDecl2);
          func(mockDecl2Dup);
          func(mockDecl3);
          func(mockDecl3NonDup);
        }),
    };

    const mockRoot = {
      walkDecls: () => {},
      walkRules: jest
        .fn()
        .mockImplementation((regex, func) => {
          if (String(regex) === String(RegExp('.default'))) {
            func(mockDefaultNode);
          } else if (String(regex) === String(RegExp('.a'))) {
            func(mockANode);
          } else if (String(regex) === String(RegExp('.b'))) {
            func(mockBNode);
          } else {
            throw new Error(`Invalid reg ex passed while walking the nodes: ${regex}`);
          }
        }),
    };

    plugin(mockRoot);

    expect(themeableVariableInformation).toMatchSnapshot();
  });
});
