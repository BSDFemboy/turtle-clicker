module.exports = {
  packagerConfig: {
    icon: './logo'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        options: {
          icon: './logo'
        }
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './logo'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: './logo'
        }
      },
    },
  ],
};
