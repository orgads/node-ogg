{
  'targets': [
    {
      'target_name': 'ogg',
      'type': 'shared_library',
      'product_extension': 'node',
      'defines': [ 'BUILDING_NODE_EXTENSION' ],
      'include_dirs': [ "<!(node -e \"require('nan')\")" ],
      'sources': [
        'src/binding.cc',
      ],
      'dependencies': [
        'deps/libogg.gyp:libogg',
        'deps/libogg.gyp:test',
      ],
      'conditions': [
        ['OS=="mac" or OS=="linux"', {
          'cflags!': [],
          'cflags_cc!': [],
          'cflags_cc': [ '-std=c++20' ],
          'libraries': [
            '-Wl,-force_load,<(module_root_dir)/build/$(BUILDTYPE)/ogg.a'
          ],
          'xcode_settings': {
            'OTHER_CPLUSPLUSFLAGS': [ '-std=c++20' ],
            'OTHER_LDFLAGS': [ '-undefined dynamic_lookup' ],
          },
        }],
        ['OS=="win"', {
          'msvs_settings': {
            'VCCLCompilerTool': {
              'AdditionalOptions': [ '/std:c++20' ],
            },
            'VCLinkerTool': {
              'ModuleDefinitionFile': '<(module_root_dir)\\deps\\libogg\\win32\\ogg.def',
            },
          },
        }],
      ],
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': ['ogg'],
      'copies': [{
        'files': ['<(PRODUCT_DIR)/ogg.node'],
        'destination': 'out',
      }],
    },
  ],
}
