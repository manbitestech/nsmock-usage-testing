
const SuiteCloudJestConfiguration = require("@oracle/suitecloud-unit-testing")
const nsMockConfig = require("@manbitestech/nsmock")

module.exports = SuiteCloudJestConfiguration.build({
	projectFolder: 'src',
    projectType: SuiteCloudJestConfiguration.ProjectType.ACP,
    verbose: true,
    testMatch: ['<rootDir>/__tests__/**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    customStubs: nsMockConfig,
    sourcemap:true
})
