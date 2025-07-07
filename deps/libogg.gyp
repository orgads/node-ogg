# This file is used with the GYP meta build system.
# http://code.google.com/p/gyp
# To build try this:
#   svn co http://gyp.googlecode.com/svn/trunk gyp
#   ./gyp/gyp -f make --depth=. libogg.gyp
#   make
#   ./out/Debug/test

{
  'variables': {
    'target_arch%': 'ia32', # built for a 32-bit CPU by default
    'libogg_build': '<(PRODUCT_DIR)/libogg',
  },
  'target_defaults': {
    'default_configuration': 'Debug',
    'configurations': {
      'Debug': {
        'defines': [ 'DEBUG', '_DEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 1, # static debug
          },
        },
      },
      'Release': {
        'defines': [ 'NDEBUG' ],
        'msvs_settings': {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 0, # static release
          },
        },
      }
    },
    'msvs_settings': {
      'VCLinkerTool': {
        'GenerateDebugInformation': 'true',
      },
    },
    'conditions': [
      ['OS=="mac"', {
        'conditions': [
          ['target_arch=="ia32"', { 'xcode_settings': { 'ARCHS': [ 'i386' ] } }],
          ['target_arch=="x64"', { 'xcode_settings': { 'ARCHS': [ 'x86_64' ] } }]
        ],
      }],
    ]
  },

  'targets': [
    {
      'target_name': 'libogg_cmake_config',
      'type': 'none',
      'actions': [
        {
          'action_name': 'cmake_configure',
          'inputs': ['libogg/CMakeLists.txt'],
          'outputs': ['<(libogg_build)/include/ogg/config_types.h'],
          'action': [
            'cmake',
            '-B', '<(libogg_build)',
            '-S', 'libogg',
          ],
          'message': 'Configuring libogg with cmake'
        }
      ],
    },
    {
      'target_name': 'libogg',
      'product_prefix': '',
      'type': 'static_library',
      'dependencies': ['libogg_cmake_config'],
      'sources': [
        'libogg/src/framing.c',
        'libogg/src/bitwise.c',
      ],
      'defines': [
        'PIC',
      ],
      'include_dirs': [
        'libogg/include',
        '<(libogg_build)/include',
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          'libogg/include',
          '<(libogg_build)/include',
        ],
      },
    },
    {
      'target_name': 'test',
      'type': 'executable',
      'dependencies': [ 'libogg' ],
      'include_dirs': [
        'libogg/include',
        '<(libogg_build)/include',
      ],
      'sources': [ 'test.c' ]
    },
  ]
}
