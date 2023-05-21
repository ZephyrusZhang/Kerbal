module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}' // 指定要收集覆盖率信息的源代码文件路径
    ],
    coverageReporters: [
      'lcov', // 使用lcov格式生成报告
      'text' // 在终端中以文本形式显示覆盖率报告
    ],
  };
  